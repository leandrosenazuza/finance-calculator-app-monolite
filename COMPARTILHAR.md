# Como Compartilhar o Projeto Localmente

## Opção 1: Mesma Rede Wi-Fi (Mais Simples)

### Passo a Passo:

1. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Anote o IP que aparece no terminal:**
   ```
   🌐 Acesse localmente: http://192.168.x.x:3001
   ```

3. **Compartilhe o link com seu amigo:**
   - O link será algo como: `http://192.168.1.100:3001`
   - Seu amigo precisa estar na **mesma rede Wi-Fi** que você

4. **Seu amigo acessa:**
   - Abre o navegador e cola o link
   - Pronto! 🎉

### ⚠️ Importante:
- Ambos precisam estar na mesma rede Wi-Fi
- Firewall pode bloquear - pode precisar permitir conexões na porta 3001
- O IP pode mudar se você reconectar na rede

---

## Opção 2: Acesso Externo com ngrok (Mais Versátil)

Permite acesso de qualquer lugar, mesmo fora da sua rede.

### Passo a Passo:

1. **Instale o ngrok (uma vez só):**
   ```bash
   npm install -g ngrok
   ```
   Ou baixe em: https://ngrok.com/download

2. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

3. **Em outro terminal, inicie o ngrok:**
   ```bash
   ngrok http 3001
   ```
   
   Ou se estiver em desenvolvimento:
   ```bash
   ngrok http 5173
   ```

4. **Copie o link HTTPS que aparece:**
   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:3001
   ```

5. **Compartilhe esse link com seu amigo:**
   - Exemplo: `https://abc123.ngrok.io`
   - Funciona de qualquer lugar! 🌍

### ⚠️ Limitações do ngrok gratuito:
- Link muda a cada vez que você reinicia
- Pode ter limite de conexões simultâneas
- Versão gratuita pode ter timeout

---

## Opção 3: Configurar Port Forwarding (Avançado)

Se você tem acesso ao roteador:

1. Configure port forwarding da porta 3001 para seu computador
2. Descubra seu IP público: https://whatismyipaddress.com
3. Compartilhe: `http://SEU_IP_PUBLICO:3001`

⚠️ **Cuidado:** Isso expõe seu servidor na internet. Use apenas para testes!

---

## Troubleshooting

### "Não consigo acessar de outro dispositivo"

1. **Verifique o firewall:**
   - Windows: Permitir aplicativo através do firewall
   - Mac: Configurações > Segurança > Firewall
   - Linux: `sudo ufw allow 3001`

2. **Verifique se estão na mesma rede:**
   - Ambos devem estar no mesmo Wi-Fi
   - Não funciona entre redes diferentes sem ngrok

3. **Teste localmente primeiro:**
   - Acesse `http://localhost:3001` no seu computador
   - Se funcionar, o problema é de rede

### "O link não funciona"

- Verifique se o servidor está rodando
- Confirme o IP correto no terminal
- Tente acessar pelo IP local primeiro

---

## Dicas de Segurança

- ⚠️ Não exponha em produção sem autenticação adequada
- ⚠️ Use ngrok apenas para testes/desenvolvimento
- ⚠️ Em produção, use HTTPS e autenticação adequada
- ✅ Para desenvolvimento local, mesma rede Wi-Fi é seguro

