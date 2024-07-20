variable "project_name" {
  type = string
  default = "first-function-399016" // project id
}

variable "region" {
  type        = string
  default     = "europe-west1"
  description = "Example eu-west9"
}

variable "deployment-version" {
  type        = string
  description = "Will be dynamically changed at each deployment"
}
