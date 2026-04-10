from google.cloud import vision

def extract_text(image_path: str):
    client = vision.ImageAnnotatorClient()

    with open(image_path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.text_detection(image=image) #type:ignore

    if response.error.message:
        print("OCR ERROR:", response.error.message)
        return ""

    texts = response.text_annotations

    if texts:
        extracted = texts[0].description
        print("RAW OCR TEXT:\n", extracted)
        return extracted
    else:
        return ""