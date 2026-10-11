variable "environment" {
  description = "Environment name, for example dev, staging, qa, or prod."
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{0,62}$", var.environment))
    error_message = "environment must start with a lowercase letter and contain only lowercase letters, numbers, or hyphens."
  }
}

variable "project_id" {
  description = "GCP project ID to bootstrap for this environment."
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{4,28}[a-z0-9]$", var.project_id))
    error_message = "project_id must be a valid GCP project ID."
  }
}

variable "region" {
  description = "GCP region used for regional bootstrap resources."
  type        = string
  default     = "asia-southeast1"
}

variable "state_bucket_name" {
  description = "Optional globally unique Terraform state bucket name. Defaults to <project_id>-tfstate."
  type        = string
  default     = null
  nullable    = true

  validation {
    condition = (
      var.state_bucket_name == null ||
      can(regex("^[a-z0-9][a-z0-9._-]{1,61}[a-z0-9]$", var.state_bucket_name))
    )
    error_message = "state_bucket_name must be a valid 3-63 character GCS bucket name."
  }
}

variable "terraform_deployer_account_id" {
  description = "Service account ID used by CI/CD to run Terraform in this environment."
  type        = string
  default     = "terraform-deployer"

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{4,28}[a-z0-9]$", var.terraform_deployer_account_id))
    error_message = "terraform_deployer_account_id must be a valid 6-30 character service account ID."
  }
}

variable "terraform_deployer_project_roles" {
  description = "Project-level roles granted to the CI/CD Terraform deployer."
  type        = set(string)
  default = [
    "roles/artifactregistry.admin",
    "roles/cloudbuild.builds.builder",
    "roles/cloudbuild.builds.editor",
    "roles/firebase.admin",
    "roles/iam.serviceAccountAdmin",
    "roles/iam.serviceAccountUser",
    "roles/logging.logWriter",
    "roles/resourcemanager.projectIamAdmin",
    "roles/serviceusage.serviceUsageAdmin",
    "roles/storage.admin",
  ]
}

variable "bootstrap_operator_principal" {
  description = "Optional IAM principal that performs the one-time local application apply, for example user:name@example.com."
  type        = string
  default     = null
  nullable    = true

  validation {
    condition = (
      var.bootstrap_operator_principal == null ||
      can(regex("^(user|serviceAccount):[^[:space:]]+$", var.bootstrap_operator_principal))
    )
    error_message = "bootstrap_operator_principal must be null or a user:/serviceAccount: IAM principal."
  }
}

variable "bootstrap_operator_project_roles" {
  description = "Project roles granted to the optional local bootstrap operator."
  type        = set(string)
  default = [
    "roles/firebase.admin",
    "roles/serviceusage.serviceUsageAdmin",
  ]
}

variable "secret_ids" {
  description = "Secret Manager secrets to create without secret values."
  type        = set(string)
  default     = []
}
