terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.51.0"
    }
  }
}

provider "google" {
  project = var.project_name
  region  = var.region
}

data "archive_file" "function_dist" {
  type        = "zip"
  source_dir  = ".."
  output_path = "../download-server.zip"
}

resource "google_storage_bucket_object" "app" {
  name   = "download-server.zip"
  source = data.archive_file.function_dist.output_path
  bucket = var.bucket_name
}

resource "google_app_engine_standard_app_version" "latest_version" {

  version_id = var.deployment-version
  service    = "mediadownloadservice"
  runtime    = "nodejs20"

  entrypoint {
    shell = "node index.js"
  }

  deployment {
    zip {
      source_url = "https://storage.googleapis.com/${var.bucket_name}/${google_storage_bucket_object.app.name}"
    }
  }

  instance_class = "F1"

  automatic_scaling {
    max_concurrent_requests = 10
    min_idle_instances      = 1
    max_idle_instances      = 3
    min_pending_latency     = "1s"
    max_pending_latency     = "5s"
    standard_scheduler_settings {
      target_cpu_utilization        = 0.5
      target_throughput_utilization = 0.75
      min_instances                 = 0
      max_instances                 = 4
    }
  }
  noop_on_destroy = true
  delete_service_on_destroy = true
}
