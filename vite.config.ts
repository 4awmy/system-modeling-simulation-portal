import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

// Helper function to recursively search files in the workspace, skipping heavy directories
function getFilesRecursively(dir: string, baseDir: string): { path: string; isDir: boolean }[] {
  let results: { path: string; isDir: boolean }[] = [];
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);
    const relPath = path.relative(baseDir, filePath).replace(/\\/g, '/');
    
    // Ignore build assets, git internals, node modules, lock files and OS files
    if (
      file === 'node_modules' || 
      file === '.git' || 
      file === 'dist' || 
      file === '.antigravitycli' || 
      file === 'package-lock.json' ||
      file === '.DS_Store' ||
      file === 'Thumbs.db'
    ) {
      continue;
    }
    
    if (stat.isDirectory()) {
      results.push({ path: relPath, isDir: true });
      results = results.concat(getFilesRecursively(filePath, baseDir));
    } else {
      results.push({ path: relPath, isDir: false });
    }
  }
  return results;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-json-db',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Decode URL to handle spaces and special characters
          const decodedUrl = decodeURIComponent(req.url || '');
          if (decodedUrl.startsWith('/Lectures/') || decodedUrl.startsWith('/Section/')) {
            const relativePath = decodedUrl.startsWith('/') ? decodedUrl.slice(1) : decodedUrl;
            const filePath = path.resolve(__dirname, '..', relativePath);
            if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
              res.writeHead(200, { 'Content-Type': 'application/pdf' });
              const fileStream = fs.createReadStream(filePath);
              fileStream.pipe(res);
              return;
            }
          }

          if (req.url === '/api/save' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const { filename, data } = JSON.parse(body);
                // Whitelist database files to prevent arbitrary path traversal writes
                const allowedFiles = ['lectures.json', 'exercises.json', 'announcements.json'];
                if (allowedFiles.includes(filename)) {
                  const filePath = path.resolve(__dirname, 'src/data', filename);
                  
                  // Ensure parent directories exist
                  fs.mkdirSync(path.dirname(filePath), { recursive: true });
                  
                  // Write updated content formatted nicely
                  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
                  
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true }));
                } else {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Forbidden file update' }));
                }
              } catch (error: unknown) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
              }
            });
          } else if (req.url === '/api/git-sync' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const { commitMessage } = JSON.parse(body);
                const cleanMessage = (commitMessage || 'Instructor updates via portal').replace(/["`\\]/g, '');
                
                // Run git push sequence
                const gitCmd = `git add . && git commit -m "${cleanMessage}" && git push`;
                
                exec(gitCmd, { cwd: __dirname }, (error, stdout, stderr) => {
                  if (error) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                      success: false, 
                      error: error.message, 
                      stderr: stderr, 
                      stdout: stdout 
                    }));
                  } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                      success: true, 
                      stdout: stdout, 
                      stderr: stderr 
                    }));
                  }
                });
              } catch (error: unknown) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
              }
            });
          } else if (req.url === '/api/list-files' && (req.method === 'GET' || req.method === 'POST')) {
            try {
              const files = getFilesRecursively(__dirname, __dirname);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, files }));
            } catch (error: unknown) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
            }
          } else if (req.url === '/api/read-file' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const { filepath } = JSON.parse(body);
                const safePath = path.resolve(__dirname, filepath);
                if (!safePath.startsWith(__dirname)) {
                  res.writeHead(403, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Access denied: Directory traversal' }));
                  return;
                }
                if (!fs.existsSync(safePath) || !fs.lstatSync(safePath).isFile()) {
                  res.writeHead(404, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'File not found' }));
                  return;
                }
                const content = fs.readFileSync(safePath, 'utf-8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, content }));
              } catch (error: unknown) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
              }
            });
          } else if (req.url === '/api/write-file' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const { filepath, content } = JSON.parse(body);
                const safePath = path.resolve(__dirname, filepath);
                if (!safePath.startsWith(__dirname)) {
                  res.writeHead(403, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Access denied: Directory traversal' }));
                  return;
                }
                
                // Ensure parent directory exists
                fs.mkdirSync(path.dirname(safePath), { recursive: true });
                
                fs.writeFileSync(safePath, content, 'utf-8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
              } catch (error: unknown) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
              }
            });
          } else if (req.url === '/api/create-file' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const { filepath, isDir } = JSON.parse(body);
                const safePath = path.resolve(__dirname, filepath);
                if (!safePath.startsWith(__dirname)) {
                  res.writeHead(403, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Access denied: Directory traversal' }));
                  return;
                }
                
                if (isDir) {
                  fs.mkdirSync(safePath, { recursive: true });
                } else {
                  fs.mkdirSync(path.dirname(safePath), { recursive: true });
                  fs.writeFileSync(safePath, '', 'utf-8');
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
              } catch (error: unknown) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
              }
            });
          } else if (req.url === '/api/delete-file' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const { filepath } = JSON.parse(body);
                const safePath = path.resolve(__dirname, filepath);
                if (!safePath.startsWith(__dirname)) {
                  res.writeHead(403, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Access denied: Directory traversal' }));
                  return;
                }
                
                if (fs.existsSync(safePath)) {
                  fs.rmSync(safePath, { recursive: true, force: true });
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
              } catch (error: unknown) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
              }
            });
          } else if (req.url === '/api/run-command' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const { command } = JSON.parse(body);
                
                // Restrict command to npm run lint and npm run build for stability
                const allowedCommands = ['npm run lint', 'npm run build'];
                if (!allowedCommands.includes(command)) {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Command not allowed. Only linting and building are supported.' }));
                  return;
                }
                
                exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({
                    success: !error,
                    stdout: stdout,
                    stderr: stderr,
                    error: error ? error.message : null
                  }));
                });
              } catch (error: unknown) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './', // Ensures relative assets work on GitHub Pages subpaths
});
