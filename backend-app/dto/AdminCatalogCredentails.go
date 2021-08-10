package dto

type UpdateCatalogCredentials struct {
	Title string `form:"Title" validate:"required"`
}
