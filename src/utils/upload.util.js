import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * Saves a Base64-encoded image to a file.
 * @param {string} base64String - The Base64 string (with or without prefix).
 * @param {string} outputFolder - The folder where the image will be saved.
 * @returns {Promise<string|null>} - The saved file path or null on error.
 */
const saveBase64Image = async (base64String, outputFolder = "src/uploads") => {
  try {
    // Ensure the output folder exists
    await fs.mkdir(outputFolder, { recursive: true });

    // Extract MIME type and Base64 data
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      console.error("❌ Invalid Base64 string");
      return null;
    }

    const mimeType = matches[1]; // e.g., "image/png"
    const base64Data = matches[2]; // Actual Base64 content
    const extension = mimeType.split("/")[1]; // Extract file extension (png, jpg, etc.)

    // Generate a unique filename
    const fileName = `${uuidv4()}.${extension}`;
    const filePath = path.join(outputFolder, fileName);

    // Convert Base64 to Buffer and write to file
    const buffer = Buffer.from(base64Data, "base64");
    await fs.writeFile(filePath, buffer);

    console.log("✅ Image saved successfully:", filePath);
    return filePath;
  } catch (error) {
    console.error("❌ Error saving image:", error);
    return null;
  }
};

export default saveBase64Image;
