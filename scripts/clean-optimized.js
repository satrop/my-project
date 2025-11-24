import fs from 'fs/promises'
import path from 'path'

async function cleanOptimized() {
  const dir = path.resolve('./public/assets/fonts/icons/optimized')

  try {
    const files = await fs.readdir(dir)

    await Promise.all(
      files.map(file => fs.unlink(path.join(dir, file)))
    )

    console.log('✅ Cleaned optimized icons folder.')
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('ℹ️ Optimized icons folder does not exist yet, no cleanup needed.')
    } else {
      console.error('❌ Error cleaning optimized icons folder:', err)
      process.exit(1)
    }
  }
}

cleanOptimized()