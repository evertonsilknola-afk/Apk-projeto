# Estudei — controle de estudos (ACS Porto Velho) — 100% offline

App React empacotado com Capacitor. Todos os dados ficam no próprio aparelho (localStorage).
Nenhuma chamada de internet: fontes, ícones e CSS estão embutidos no build.

## Gerar o APK

### Opção A — GitHub Actions (sem instalar nada)
1. Crie um repositório no GitHub e envie esta pasta (`git init`, `git add .`, `git commit`, `git push`).
2. Aba **Actions → Build APK → Run workflow** (roda sozinho a cada push também).
3. Ao terminar, baixe o artefato **estudei-apk** → `app-debug.apk` e instale no celular
   (permita "instalar de fontes desconhecidas").

### Opção B — No seu computador (Node 18+, JDK 17, Android Studio/SDK)
```bash
npm install
npm run build
npx cap add android
npx cap sync android
cd android && ./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```
Ou `npx cap open android` e use Build > Build APK(s) no Android Studio.

## Backup
Botões no topo: **Exportar** (abre o menu de compartilhar do Android para salvar o .json
no Drive/WhatsApp/arquivos) e **Importar** (escolha o .json salvo).
