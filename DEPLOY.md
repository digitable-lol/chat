# Digitable Chat deployment

Production domain: `chat.digitable.life`  
Server path: `/www/wwwroot/chat.digitable.life`  
Generated output: `dist/`

## Server directory

Compare ownership with an existing Digitable site before applying it:

```bash
stat -c "%U:%G %a %n" /www/wwwroot/happy-calendar.digitable.life
mkdir -p /www/wwwroot/chat.digitable.life
chown -R githubactionuser:githubactionuser /www/wwwroot/chat.digitable.life
chmod -R u+rwX /www/wwwroot/chat.digitable.life
```

## GitHub repository secrets

```bash
gh secret set DIGITABLE_HOST \
  --repo digitable-lol/chat \
  --body "80.66.72.71"

gh secret set DIGITABLE_USERNAME \
  --repo digitable-lol/chat \
  --body "githubactionuser"

gh secret set DIGITABLE_SSH_KEY \
  --repo digitable-lol/chat \
  < /home/githubactionuser/.ssh/id_ed25519

gh secret set DIGITABLE_CHAT_ICE_SERVERS_URL \
  --repo digitable-lol/chat \
  --body "https://example.com/api/rtc/ice-servers"
```

The ICE endpoint must create short-lived TURN credentials. Do not place permanent TURN usernames or credentials in GitHub variables or source files.

Optional controlled MQTT signaling:

```bash
gh variable set SIGNALING_RELAY_URLS \
  --repo digitable-lol/chat \
  --body "wss://mqtt.example.com/mqtt"

gh variable set SIGNALING_RELAY_REDUNDANCY \
  --repo digitable-lol/chat \
  --body "3"
```

Verify configuration:

```bash
gh secret list --repo digitable-lol/chat
gh variable list --repo digitable-lol/chat
```

## Nginx

Add the SPA fallback to the SSL-enabled server block:

```nginx
server_name chat.digitable.life;
root /www/wwwroot/chat.digitable.life;
index index.html;

location / {
    try_files $uri $uri/ /index.html;
}
```

Keep the existing HTTPS certificate and HTTP-to-HTTPS redirect. Digitable Chat requires a secure browser context for WebRTC.

## Run and verify

The workflow skips deployment cleanly until all three SSH secrets are present.

```bash
gh workflow run deploy.yml --repo digitable-lol/chat
gh run list --repo digitable-lol/chat --workflow deploy.yml
```

After deployment:

```bash
test -f /www/wwwroot/chat.digitable.life/index.html
curl -I https://chat.digitable.life/
```

For connection verification, test two browsers on different networks. The participant panel should report WebSocket signaling and show TURN relay availability when credentials are configured.
