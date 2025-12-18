variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "freeforge-481415"
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "mongodb_uri" {
    description = "MongoDB Connection String"
    type = string
    sensitive = true
}

variable "jwt_secret" {
    description = "JWT Secret for authentication"
    type = string
    sensitive = true
}

variable "admin_email" {
    description = "Default admin email"
    type = string
    default = "admin@freeforge.com"
}

variable "admin_password" {
    description = "Default admin password"
    type = string
    sensitive = true
}

