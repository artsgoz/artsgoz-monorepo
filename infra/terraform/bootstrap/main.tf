terraform {
  required_version = ">= 1.6.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~>7.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

locals {
  state_bucket_name = coalesce(
    var.state_bucket_name,
    "${var.project_id}-tfstate",
  )

  bootstrap_services = toset([
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "cloudtasks.googleapis.com",
    "developerconnect.googleapis.com",
    "firebase.googleapis.com",
    "firebaseapphosting.googleapis.com",
    "firebasehosting.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "serviceusage.googleapis.com",
    "storage.googleapis.com",
  ])
}

module "project_services" {
  source = "../modules/project-services"

  project_id = var.project_id
  services   = local.bootstrap_services
}

resource "google_storage_bucket" "terraform_state" {
  project  = var.project_id
  name     = local.state_bucket_name
  location = var.region

  force_destroy               = false
  public_access_prevention    = "enforced"
  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  labels = {
    environment = var.environment
    managed_by  = "terraform"
    purpose     = "terraform-state"
  }

  depends_on = [module.project_services]
}

resource "google_service_account" "terraform_deployer" {
  project      = var.project_id
  account_id   = var.terraform_deployer_account_id
  display_name = "Terraform deployer (${var.environment})"
  description  = "CI/CD identity used to plan and apply Terraform for the ${var.environment} environment."

  depends_on = [module.project_services]
}

resource "google_project_iam_member" "terraform_deployer" {
  for_each = var.terraform_deployer_project_roles

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.terraform_deployer.email}"
}

resource "google_project_iam_member" "bootstrap_operator" {
  for_each = var.bootstrap_operator_principal == null ? toset([]) : var.bootstrap_operator_project_roles

  project = var.project_id
  role    = each.value
  member  = var.bootstrap_operator_principal
}

module "secrets" {
  source = "../modules/secret-manager"

  project_id = var.project_id
  secret_ids = var.secret_ids

  depends_on = [module.project_services]
}

output "environment" {
  description = "Environment bootstrapped by this configuration."
  value       = var.environment
}

output "project_id" {
  description = "GCP project bootstrapped by this configuration."
  value       = var.project_id
}

output "terraform_state_bucket" {
  description = "GCS bucket that stores Terraform state for this environment."
  value       = google_storage_bucket.terraform_state.name
}

output "terraform_deployer_service_account_email" {
  description = "Service account email for the CI/CD Terraform deployer."
  value       = google_service_account.terraform_deployer.email
}

output "secret_names" {
  description = "Secret Manager resource names keyed by secret ID."
  value       = module.secrets.secret_names
}
