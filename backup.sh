#!/bin/bash
# Pharmex Satıcı Panel yedekleme scripti

# Yedek dosya ismini tarih-saat ile oluştur
BACKUP_NAME="pharmex-satici-panel-pro_yedek_$(date +%Y-%m-%d_%H-%M).zip"

# Bir üst klasöre çık ve zip oluştur
cd ..
zip -r "$BACKUP_NAME" pharmex-satici-panel-pro

echo "✅ Yedek oluşturuldu: $BACKUP_NAME"}
