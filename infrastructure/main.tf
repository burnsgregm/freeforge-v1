terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_cloud_run_service" "api" {
  name     = "motiongrid-api"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/motiongrid-api:latest"
        ports {
            container_port = 8080
        }
        resources {
          limits = {
            cpu    = "1000m"
            memory = "2Gi"
          }
        }
        env {
          name  = "MONGODB_URI"
          value = var.mongodb_uri
        }
        env {
            name = "SIMULATION_API_URL"
            value = "https://motiongrid-simulation-rrsyyeqnbq-uc.a.run.app"
        }
        env {
          name  = "JWT_SECRET"
          value = var.jwt_secret
        }
        env {
          name  = "ADMIN_EMAIL"
          value = var.admin_email
        }
          env {
            name  = "ADMIN_PASSWORD"
            value = var.admin_password
          }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service" "simulation" {
  name     = "motiongrid-simulation"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/motiongrid-simulation:latest"
        ports {
            container_port = 8000
        }
        resources {
          limits = {
            cpu    = "2000m"
            memory = "2Gi"
          }
        }
        env {
          name  = "MONGODB_URI"
          value = var.mongodb_uri
        }
        env {
          name  = "API_URL"
          value = google_cloud_run_service.api.status[0].url
        }
      }
    }
  }
}

resource "google_cloud_run_service" "frontend" {
  name     = "motiongrid-frontend"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/motiongrid-frontend:latest"
        ports {
            container_port = 80
        }
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
        env {
            name = "VITE_API_URL"
            value = google_cloud_run_service.api.status[0].url
        }
      }
    }
  }
}

resource "google_cloud_run_service_iam_member" "public_access_frontend" {
  service  = google_cloud_run_service.frontend.name
  location = google_cloud_run_service.frontend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Storage Bucket for Session Recordings
resource "google_storage_bucket" "sessions" {
  name     = "${var.project_id}-sessions"
  location = var.region
  
  uniform_bucket_level_access = true
  
  lifecycle_rule {
    action { type = "Delete" }
    condition { age = 180 }  # Keep recordings 6 months
  }
}

resource "google_cloud_run_service_iam_member" "public_access_api" {
  service  = google_cloud_run_service.api.name
  location = google_cloud_run_service.api.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_service_iam_member" "public_access_simulation" {
  service  = google_cloud_run_service.simulation.name
  location = google_cloud_run_service.simulation.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "frontend_url" {
  value = google_cloud_run_service.frontend.status[0].url
}
