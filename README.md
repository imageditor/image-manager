# image-manager

1. Insert record about uploading images
> - project_id
> - status (waiting/loaded/error)
> - transformation (original/grayscale) in future it may be different tables
> - parent_image (original_filename/original_image_id)
> - new_filename (uuid.extension)
> - minimized_image (binary)

2. Upload images, change status
3. Select original images
4. Select transformed images by parent_image
