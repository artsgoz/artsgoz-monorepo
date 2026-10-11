region               = "asia-southeast1"
app_hosting_location = "asia-east1"
hosting_custom_domains = {
  aksornsara-frontend = "dev.aksornsara.artsgoz.com"
}
api_custom_domain         = "api.dev.aksornsara.artsgoz.com"
frontend_maintenance_mode = false

# Enable after this repository is linked through Cloud Build v2 in this project.
# cloud_build_repository = {
#   location        = "asia-southeast1"
#   connection_name = "artsgoz"
#   repository_name = "artsgoz-monorepo"
# }
