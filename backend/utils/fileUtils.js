import fs from "fs"
import path from "path"

export const deleteFileIfExists = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
    }
}