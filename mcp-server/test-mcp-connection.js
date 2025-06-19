#!/usr/bin/env node

import { spawn } from 'child_process';
import { createReadStream, createWriteStream } from 'fs';

// Test the MCP server with proper initialization
async function testMCPServer() {
    console.log('Testing BRX MCP Server...');
    
    const initRequest = {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: {
                name: "test-client",
                version: "1.0.0"
            }
        }
    };
    
    const listToolsRequest = {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list"
    };
    
    console.log('Sending initialize request...');
    console.log(JSON.stringify(initRequest));
    
    const mcpProcess = spawn('node', ['src/index.js'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let response = '';
    
    mcpProcess.stdout.on('data', (data) => {
        response += data.toString();
        console.log('Response:', data.toString());
    });
    
    mcpProcess.stderr.on('data', (data) => {
        console.error('Error:', data.toString());
    });
    
    // Send initialize request
    mcpProcess.stdin.write(JSON.stringify(initRequest) + '\n');
    
    // Wait a bit then send tools list request
    setTimeout(() => {
        console.log('Sending tools/list request...');
        mcpProcess.stdin.write(JSON.stringify(listToolsRequest) + '\n');
        
        setTimeout(() => {
            mcpProcess.kill();
            console.log('Test completed.');
        }, 2000);
    }, 1000);
    
    mcpProcess.on('exit', (code) => {
        console.log(`MCP server exited with code ${code}`);
    });
}

testMCPServer().catch(console.error);