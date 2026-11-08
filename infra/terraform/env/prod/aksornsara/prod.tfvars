region = "asia-southeast1"
hosting_custom_domains = {
  aksornsara-frontend = "aksornsara.artsgoz.com"
}
api_custom_domain         = "api.aksornsara.artsgoz.com"
frontend_maintenance_mode = true

# Enable after this repository is linked through Cloud Build v2 in this project.
cloud_build_repository = {
  location        = "asia-southeast1"
  connection_name = "artsgoz"
  repository_name = "artsgoz-artsgoz-monorepo"
}

api_base_url = "https://api.artsgoz.com/api"
