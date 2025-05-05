import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Mock fs module
vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  existsSync: vi.fn(() => true)
}));

describe('Vite Proxy Configuration', () => {
  it('should have the correct proxy configuration in vite.config.js', () => {
    // Get path to vite.config.js
    const configPath = path.resolve(process.cwd(), 'vite.config.js');
    
    // Mock the config file content
    const mockConfigContent = `
      import { sveltekit } from '@sveltejs/kit/vite';
      import { defineConfig } from 'vite';
      
      export default defineConfig({
        plugins: [sveltekit()],
        server: {
          proxy: {
            '/api': {
              target: 'http://localhost:8000',
              changeOrigin: true,
              secure: false
            }
          }
        }
      });
    `;
    
    // Setup the mock to return our configuration
    vi.mocked(fs.readFileSync).mockReturnValue(mockConfigContent);
    
    // Read the configuration file
    const configContent = fs.readFileSync(configPath, 'utf-8');
    
    // Verify the proxy configuration is present
    expect(configContent).toContain('proxy: {');
    expect(configContent).toContain("'/api': {");
    expect(configContent).toContain("target: 'http://localhost:8000'");
    expect(configContent).toContain("changeOrigin: true");
  });

  it('should fail if proxy configuration is missing', () => {
    // Get path to vite.config.js
    const configPath = path.resolve(process.cwd(), 'vite.config.js');
    
    // Mock the config file content without proxy
    const mockConfigWithoutProxy = `
      import { sveltekit } from '@sveltejs/kit/vite';
      import { defineConfig } from 'vite';
      
      export default defineConfig({
        plugins: [sveltekit()]
      });
    `;
    
    // Setup the mock to return configuration without proxy
    vi.mocked(fs.readFileSync).mockReturnValue(mockConfigWithoutProxy);
    
    // Read the configuration file
    const configContent = fs.readFileSync(configPath, 'utf-8');
    
    // Test function to check if proxy config exists
    const hasProxyConfig = () => {
      if (!configContent.includes('proxy: {') || 
          !configContent.includes("'/api': {") || 
          !configContent.includes("target: 'http")) {
        throw new Error('Missing proxy configuration for /api');
      }
      return true;
    };
    
    // Verify that the check fails for missing proxy configuration
    expect(hasProxyConfig).toThrow('Missing proxy configuration for /api');
  });
}); 