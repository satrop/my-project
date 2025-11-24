#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

async function renameIconFiles() {
  const dir = path.resolve('./public/assets/fonts/icons/optimized');
  
  try {
    const files = await fs.readdir(dir);
    
    // Keep track of renamed files
    const renamedFiles = [];
    
    // Process each file
    for (const file of files) {
      // Only process SVG files
      if (!file.endsWith('.svg')) continue;
      
      // Check if the filename starts with 'icon-'
      if (file.startsWith('icon-')) {
        // New filename without the 'icon-' prefix
        const newFilename = file.replace(/^icon-/, '');
        const oldPath = path.join(dir, file);
        const newPath = path.join(dir, newFilename);
        
        // Rename the file
        await fs.rename(oldPath, newPath);
        renamedFiles.push({ old: file, new: newFilename });
      }
    }
    
    if (renamedFiles.length > 0) {
      console.log(`✅ Removed 'icon-' prefix from ${renamedFiles.length} files:`);
      renamedFiles.forEach(file => {
        console.log(`  - ${file.old} → ${file.new}`);
      });
    } else {
      console.log('ℹ️ No files with the \'icon-\' prefix were found.');
    }
    
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('❌ Optimized icons folder does not exist.');
    } else {
      console.error('❌ Error renaming icon files:', err);
    }
    process.exit(1);
  }
}

renameIconFiles();
