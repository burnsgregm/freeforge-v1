$ProjectId = "freeforge-481415"
$Region = "us-central1"

Write-Host "Starting deployment for Motion Intelligence Grid..."

# 1. Build and Push Containers
Write-Host "Building and Pushing Containers..."
gcloud builds submit --config cloudbuild.yaml . --project $ProjectId

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed!"
    exit 1
}

# 2. Apply Terraform
Write-Host "Applying Terraform..."
cd infrastructure
terraform init
terraform apply `
    -var="project_id=$ProjectId" `
    -var="region=$Region" `
    -var="mongodb_uri=$env:MONGODB_URI" `
    -var="jwt_secret=$env:JWT_SECRET" `
    -var="admin_password=$env:ADMIN_PASSWORD" `
    -auto-approve

if ($LASTEXITCODE -ne 0) {
    Write-Error "Terraform failed!"
    exit 1
}

Write-Host "Deployment Complete!"
