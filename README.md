# Feedback-System

Ein webbasiertes Feedback-System zur Erfassung und Auswertung von Rückmeldungen.

Das Projekt kann für unterschiedliche Veranstaltungen, Aktionen oder andere Angebote angepasst und eingesetzt werden.

## Funktionen

* Feedback von teilnehmenden und nicht teilnehmenden Personen
* Unterschiedliche Fragen abhängig von der Teilnahme
* Bewertung verschiedener Aspekte
* Freitextfelder für positives Feedback und Verbesserungsvorschläge
* Optionale Namensangabe
* Verhinderung mehrfacher Abgaben über eine Client-ID
* Speicherung der Rückmeldungen über Supabase
* Administrationsbereich zur Auswertung
* Statistische Übersicht über die eingegangenen Rückmeldungen
* Anzeige einzelner Rückmeldungen
* Aktualisierung der Feedback-Daten
* Möglichkeit zum Löschen aller gespeicherten Rückmeldungen

## Voraussetzungen

Für den Betrieb werden benötigt:

* Eine Webserver- oder Hosting-Umgebung
* Ein eigenes Supabase-Projekt
* Eine konfigurierte Supabase-Datenbank
* Ein Supabase Publishable Key

## Einrichtung

### 1. Projekt herunterladen

Das Repository kann geklont oder als ZIP-Datei heruntergeladen und anschließend auf einer geeigneten Hosting-Umgebung bereitgestellt werden.

### 2. Supabase konfigurieren

Die Verbindung zu Supabase wird direkt in den JavaScript-Dateien konfiguriert.

In `script.js` müssen folgende Werte angepasst werden:

```javascript
const SUPABASE_URL =
    "DEINE_SUPABASE_URL";

const SUPABASE_KEY =
    "DEIN_SUPABASE_PUBLISHABLE_KEY";
```

Die gleichen Werte müssen in `admin/admin.js` eingetragen werden.

**Wichtig:** Die konkreten Zugangsdaten des verwendeten Supabase-Projekts sollten nicht in einem öffentlichen Repository veröffentlicht werden, sofern dies nicht ausdrücklich vorgesehen ist.

### 3. Datenbank einrichten

Das Projekt benötigt zwei Tabellen:

* `feedback`
* `feedback_submissions`

Beide Tabellen müssen im eigenen Supabase-Projekt im Schema `public` vorhanden sein.

## Datenbankstruktur

Die folgende Datenbankstruktur entspricht der aktuellen Beispielkonfiguration des Projekts.

Die **Spalten können je nach Verwendungszweck angepasst, entfernt oder erweitert werden**. Dadurch kann das Feedback-System beispielsweise für andere Veranstaltungen oder vollständig andere Arten von Feedback verwendet werden.

Bei Änderungen an den Spalten müssen die davon betroffenen JavaScript-Dateien entsprechend angepasst werden, damit Formulare, Auswertung und Datenbank weiterhin miteinander übereinstimmen.

### `feedback`

Die Tabelle `feedback` speichert die abgegebenen Rückmeldungen.

| Spalte                 | Datentyp                   | NULL erlaubt | Standardwert |
| ---------------------- | -------------------------- | ------------ | ------------ |
| `id`                   | `bigint`                   | Nein         | –            |
| `created_at`           | `timestamp with time zone` | Nein         | `now()`      |
| `name`                 | `text`                     | Ja           | –            |
| `reason`               | `text`                     | Ja           | –            |
| `additional_text`      | `text`                     | Ja           | –            |
| `participation`        | `text`                     | Ja           | –            |
| `overall_rating`       | `text`                     | Ja           | –            |
| `difficulty`           | `text`                     | Ja           | –            |
| `length_rating`        | `text`                     | Ja           | –            |
| `clue_clarity`         | `text`                     | Ja           | –            |
| `variety_rating`       | `text`                     | Ja           | –            |
| `fun_rating`           | `text`                     | Ja           | –            |
| `positive_feedback`    | `text`                     | Ja           | –            |
| `improvement_feedback` | `text`                     | Ja           | –            |
| `additional_feedback`  | `text`                     | Ja           | –            |

### `feedback_submissions`

Die Tabelle `feedback_submissions` speichert die Client-ID eines Geräts, nachdem eine Rückmeldung abgegeben wurde. Dadurch kann eine erneute Abgabe über denselben Client verhindert werden.

| Spalte       | Datentyp                   | NULL erlaubt | Standardwert |
| ------------ | -------------------------- | ------------ | ------------ |
| `id`         | `bigint`                   | Nein         | –            |
| `client_id`  | `uuid`                     | Nein         | –            |
| `created_at` | `timestamp with time zone` | Ja           | `now()`      |

### Datenbank anpassen

Die Datenbank kann vollständig an die jeweiligen Anforderungen angepasst werden.

Beispielsweise können:

* vorhandene Spalten umbenannt werden
* nicht benötigte Spalten entfernt werden
* zusätzliche Fragen als neue Spalten ergänzt werden
* zusätzliche Bewertungskriterien hinzugefügt werden
* andere Datentypen verwendet werden
* weitere Tabellen für zusätzliche Funktionen erstellt werden

Die hier aufgeführte Struktur dient daher als Beispiel und Ausgangspunkt für eine eigene Konfiguration.

**Wichtig:** Änderungen an der Datenbankstruktur müssen auch im zugehörigen JavaScript-Code berücksichtigt werden. Werden beispielsweise Spalten umbenannt oder entfernt, müssen die entsprechenden Datenbankabfragen und Formularfelder ebenfalls angepasst werden.

### Datenbankberechtigungen

Die benötigten Row-Level-Security-Policies (RLS) und Berechtigungen müssen im jeweiligen Supabase-Projekt entsprechend der gewünschten Verwendung eingerichtet werden.

Dabei sollte insbesondere berücksichtigt werden:

* Welche Nutzer Daten einfügen dürfen
* Welche Daten öffentlich gelesen werden dürfen
* Wer Zugriff auf den Administrationsbereich besitzt
* Wer Rückmeldungen löschen darf
* Wie der Zugriff auf die Tabellen abgesichert wird

Die konkrete Konfiguration hängt vom jeweiligen Einsatz des Projekts ab.

## Verwendung

### Feedback-Seite

Auf der Feedback-Seite können Nutzer angeben, ob sie an der jeweiligen Veranstaltung teilgenommen haben.

Abhängig von der Auswahl werden die entsprechenden Fragen angezeigt.

Nach dem Absenden wird die Rückmeldung in der Supabase-Datenbank gespeichert.

Eine Client-ID wird über ein Cookie verwaltet und zur Begrenzung mehrfacher Abgaben verwendet.

### Administrationsbereich

Der Administrationsbereich ermöglicht die Anmeldung mit einem Supabase-Benutzerkonto.

Nach erfolgreicher Anmeldung können:

* Statistiken eingesehen werden
* eingegangene Rückmeldungen betrachtet werden
* die Daten aktualisiert werden
* alle gespeicherten Rückmeldungen gelöscht werden

## Projektstruktur

Das Projekt besteht aus einem öffentlichen Feedback-Bereich und einem getrennten Administrationsbereich.

```text
/
├── index.html
├── script.js
├── style.css
│
├── admin/
│   ├── index.html
│   ├── admin.js
│   └── admin.css
│
└── LICENSE
```

### Öffentlicher Bereich

Die Dateien im Hauptverzeichnis bilden den öffentlichen Feedback-Bereich:

* `index.html` – Feedback-Formular
* `script.js` – Logik des Feedback-Formulars
* `style.css` – Gestaltung der Feedback-Seite

### Administrationsbereich

Der Administrationsbereich befindet sich vollständig im Verzeichnis `admin/`:

* `admin/index.html` – Oberfläche des Administrationsbereichs
* `admin/admin.js` – Login, Datenbankabfragen, Statistiken und Feedback-Auswertung
* `admin/admin.css` – Gestaltung des Administrationsbereichs

Der Administrationsbereich ist damit technisch vom öffentlichen Feedback-Bereich getrennt und kann unabhängig angepasst werden.

## Anpassung

Das Projekt ist bewusst allgemein gehalten und kann an unterschiedliche Einsatzbereiche angepasst werden.

Unter anderem können folgende Bereiche verändert werden:

* Texte und Überschriften
* Fragen und Antwortmöglichkeiten
* Bewertungskriterien
* Datenbankspalten
* Gestaltung und CSS
* Statistiken
* Administrationsbereich
* Datenbankstruktur

Bei Änderungen an den Formularfeldern müssen die entsprechenden JavaScript-Dateien und gegebenenfalls die Datenbankstruktur angepasst werden.

## Datenschutz

Vor dem produktiven Einsatz sollte das Projekt an die geltenden Datenschutzanforderungen angepasst werden.

Insbesondere sollte geprüft werden:

* Welche personenbezogenen Daten gespeichert werden
* Ob die Namensangabe erforderlich ist
* Wie lange Daten gespeichert werden
* Wer Zugriff auf die gespeicherten Daten hat
* Welche Supabase-Richtlinien eingerichtet sind
* Ob eine Datenschutzerklärung erforderlich ist
* Ob die verwendete Client-ID datenschutzrechtlich berücksichtigt werden muss

Die konkrete Datenschutzkonfiguration und rechtliche Bewertung hängt vom jeweiligen Einsatzgebiet ab und liegt in der Verantwortung des Betreibers.

## Lizenz

Dieses Projekt steht unter der **PolyForm Noncommercial License 1.0.0**.

Die Lizenz erlaubt die Nutzung des Projekts für nicht-kommerzielle Zwecke. Dazu gehören unter anderem persönliche Nutzung, Forschung, Experimente, private Projekte sowie die Nutzung durch Bildungseinrichtungen und bestimmte andere nicht-kommerzielle Organisationen.

Eine kommerzielle Nutzung ist durch diese Lizenz nicht abgedeckt.

Der vollständige Lizenztext befindet sich in der Datei `LICENSE`.

Weitere Informationen zur Lizenz:

https://polyformproject.org/licenses/noncommercial/1.0.0
