region = "asia-southeast1"
hosting_custom_domains = {
  aksornsara-frontend = "dev.aksornsara.artsgoz.com"
}
api_custom_domain         = "dev.api.aksornsara.artsgoz.com"
frontend_maintenance_mode = false
firebase_api_key          = "AIzaSyA7KlwZjN8qMUsP3vlKBVYPPgEAOcK_V8c"
firebase_auth_domain      = "artsgoz-artsgoz-web-develop.firebaseapp.com"
firebase_project_id       = "artsgoz-artsgoz-web-develop"
firebase_app_id           = "1:78095182747:web:36aa85a087341efc194f3e"

# Enable after this repository is linked through Cloud Build v2 in this project.
cloud_build_repository = {
  location        = "asia-southeast1"
  connection_name = "artsgoz"
  repository_name = "artsgoz-artsgoz-monorepo"
}

api_base_url = "https://tmp.dev.api.artsgoz.com/api"
