## 🏪 HACS Installation

Die **einfachste** Installation ist über HACS:

### Schritt 1: Repository hinzufügen
1. **HACS** in Home Assistant öffnen
2. **Integrationen** anklicken  
3. **⋮** Menü (3 Punkte) > **Custom repositories**
4. **Repository URL** eingeben: `https://github.com/Nogg-aholic/universal-controller`
5. **Kategorie**: `Integration` auswählen
6. **Add** klicken

### Schritt 2: Integration installieren  
1. In HACS **"Universal Controller"** suchen
2. **Download** klicken
3. **Download** bestätigen
4. **Home Assistant neu starten**

### Schritt 3: Integration konfigurieren
1. **Einstellungen** > **Integrationen**
2. **Integration hinzufügen** > **"Universal Controller"** suchen
3. **Konfiguration** folgen

### Schritt 4: Karte hinzufügen
Karte zum Dashboard hinzufügen:

```yaml
type: custom:universal-controller-card
entity: sensor.universal_controller_ihre_instanz
name: Mein Universal Controller
show_code_editor: true
update_interval: 30000
```

## 📋 HACS-Features

- ✅ **Automatische Updates** über HACS
- ✅ **Ein-Klick Installation** 
- ✅ **Version Management**
- ✅ **Abhängigkeiten-Handling**
- ✅ **Saubere Deinstallation**

---

Nach der HACS-Installation haben Sie Zugriff auf:
- **Periodic TypeScript/JavaScript execution**
- **Live HTML/CSS editing** 
- **Full Home Assistant API access**
- **Custom dashboard cards**
