// ==========================================
// SUPABASE KONFIGURATION
// ==========================================

const SUPABASE_URL =
    "DEINE_SUPABASE_URL";

const SUPABASE_KEY =
    "DEIN_SUPABASE_PUBLISHABLE_KEY";


// ==========================================
// DOM-ELEMENTE
// ==========================================

const loginSection =
    document.getElementById("loginSection");

const adminSection =
    document.getElementById("adminSection");

const loginForm =
    document.getElementById("loginForm");

const loginStatus =
    document.getElementById("loginStatus");

const logoutButton =
    document.getElementById("logoutButton");

const refreshButton =
    document.getElementById("refreshButton");

const feedbackList =
    document.getElementById("feedbackList");


// ==========================================
// STATISTIK-ELEMENTE
// ==========================================

const totalCount =
    document.getElementById("totalCount");

const participantCount =
    document.getElementById("participantCount");

const nonParticipantCount =
    document.getElementById("nonParticipantCount");

const noTimeCount =
    document.getElementById("noTimeCount");

const tooHardCount =
    document.getElementById("tooHardCount");

const noDesireCount =
    document.getElementById("noDesireCount");

const otherCount =
    document.getElementById("otherCount");


// ==========================================
// LOGIN
// ==========================================

let accessToken = null;


if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email =
            document.getElementById("email")?.value.trim();

        const password =
            document.getElementById("password")?.value;


        if (!email || !password) {

            showLoginStatus(
                "Bitte E-Mail-Adresse und Passwort eingeben.",
                "error"
            );

            return;
        }


        const loginButton =
            loginForm.querySelector("button[type='submit']");


        if (loginButton) {
            loginButton.disabled = true;
        }


        try {

            const response = await fetch(
                `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
                {
                    method: "POST",

                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            if (!response.ok) {

                showLoginStatus(
                    "Anmeldung fehlgeschlagen.",
                    "error"
                );

                return;
            }


            const data =
                await response.json();


            accessToken =
                data.access_token;


            loginSection.style.display = "none";
            adminSection.style.display = "block";


            await loadFeedback();


        } catch (error) {

            console.error(
                "Login-Fehler:",
                error
            );

            showLoginStatus(
                "Beim Anmelden ist ein Fehler aufgetreten.",
                "error"
            );

        } finally {

            if (loginButton) {
                loginButton.disabled = false;
            }
        }
    });
}


// ==========================================
// FEEDBACK LADEN
// ==========================================

async function loadFeedback() {

    if (!accessToken) {
        return;
    }


    try {

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/feedback?select=*&order=created_at.desc`,
            {
                method: "GET",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization":
                        `Bearer ${accessToken}`
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Feedback konnte nicht geladen werden."
            );
        }


        const feedbacks =
            await response.json();


        displayStatistics(feedbacks);
        displayFeedbacks(feedbacks);


    } catch (error) {

        console.error(
            "Fehler beim Laden:",
            error
        );


        if (feedbackList) {

            feedbackList.innerHTML =
                `<p class="error">
                    Die Rückmeldungen konnten nicht geladen werden.
                </p>`;
        }
    }
}


// ==========================================
// STATISTIKEN
// ==========================================

function displayStatistics(feedbacks) {

    const total =
        feedbacks.length;


    const participants =
        feedbacks.filter(
            feedback => feedback.participated === true
        ).length;


    const nonParticipants =
        feedbacks.filter(
            feedback => feedback.participated === false
        ).length;


    const noTime =
        feedbacks.filter(
            feedback =>
                feedback.reason === "Keine Zeit"
        ).length;


    const tooHard =
        feedbacks.filter(
            feedback =>
                feedback.reason === "Zu schwer"
        ).length;


    const noDesire =
        feedbacks.filter(
            feedback =>
                feedback.reason === "Keine Lust"
        ).length;


    const other =
        feedbacks.filter(
            feedback =>
                feedback.reason === "Sonstige"
        ).length;


    if (totalCount) {
        totalCount.textContent = total;
    }

    if (participantCount) {
        participantCount.textContent = participants;
    }

    if (nonParticipantCount) {
        nonParticipantCount.textContent =
            nonParticipants;
    }

    if (noTimeCount) {
        noTimeCount.textContent = noTime;
    }

    if (tooHardCount) {
        tooHardCount.textContent = tooHard;
    }

    if (noDesireCount) {
        noDesireCount.textContent = noDesire;
    }

    if (otherCount) {
        otherCount.textContent = other;
    }
}


// ==========================================
// FEEDBACK ANZEIGEN
// ==========================================

function displayFeedbacks(feedbacks) {

    if (!feedbackList) {
        return;
    }


    if (feedbacks.length === 0) {

        feedbackList.innerHTML =
            "<p>Es wurden noch keine Rückmeldungen abgegeben.</p>";

        return;
    }


    feedbackList.innerHTML =
        feedbacks.map(feedback => {


            const date =
                feedback.created_at
                    ? new Date(
                        feedback.created_at
                    ).toLocaleString("de-DE")
                    : "Unbekannt";


            const name =
                feedback.name
                    ? escapeHtml(feedback.name)
                    : "Anonym";


            let content = "";


            // ==================================
            // NICHT TEILGENOMMEN
            // ==================================

            if (feedback.participated === false) {

                content = `

                    <div class="feedback-type not-participated">
                        Nicht teilgenommen
                    </div>

                    <div class="feedback-reason">

                        <strong>Grund:</strong>

                        ${escapeHtml(
                    feedback.reason || "Keine Angabe"
                )}

                    </div>

                    ${feedback.additional_text
                        ? `
                                <div class="feedback-text">

                                    <strong>Weitere Angaben:</strong>

                                    <p>
                                        ${escapeHtml(
                            feedback.additional_text
                        )}
                                    </p>

                                </div>
                            `
                        : ""
                    }
                `;


                // ==================================
                // TEILGENOMMEN
                // ==================================

            } else if (feedback.participated === true) {

                content = `

                    <div class="feedback-type participated">
                        Teilgenommen
                    </div>

                    <div class="participant-answers">

                        <div class="answer">
                            <strong>Gesamtbewertung:</strong>
                            ${escapeHtml(
                    feedback.overall_rating || "-"
                )}
                        </div>

                        <div class="answer">
                            <strong>Schwierigkeit:</strong>
                            ${escapeHtml(
                    feedback.difficulty || "-"
                )}
                        </div>

                        <div class="answer">
                            <strong>Länge:</strong>
                            ${escapeHtml(
                    feedback.length_rating || "-"
                )}
                        </div>

                        <div class="answer">
                            <strong>Verständlichkeit:</strong>
                            ${escapeHtml(
                    feedback.clue_clarity || "-"
                )}
                        </div>

                        <div class="answer">
                            <strong>Abwechslung:</strong>
                            ${escapeHtml(
                    feedback.variety_rating || "-"
                )}
                        </div>

                        <div class="answer">
                            <strong>Spaß:</strong>
                            ${escapeHtml(
                    feedback.fun_rating || "-"
                )}
                        </div>

                    </div>

                    ${feedback.positive_feedback
                        ? `
                                <div class="feedback-text">

                                    <strong>Positives Feedback:</strong>

                                    <p>
                                        ${escapeHtml(
                            feedback.positive_feedback
                        )}
                                    </p>

                                </div>
                            `
                        : ""
                    }

                    ${feedback.improvement_feedback
                        ? `
                                <div class="feedback-text">

                                    <strong>Verbesserungsvorschläge:</strong>

                                    <p>
                                        ${escapeHtml(
                            feedback.improvement_feedback
                        )}
                                    </p>

                                </div>
                            `
                        : ""
                    }

                    ${feedback.additional_feedback
                        ? `
                                <div class="feedback-text">

                                    <strong>Weitere Rückmeldung:</strong>

                                    <p>
                                        ${escapeHtml(
                            feedback.additional_feedback
                        )}
                                    </p>

                                </div>
                            `
                        : ""
                    }
                `;


                // ==================================
                // UNBEKANNTER / ÄLTERER DATENSATZ
                // ==================================

            } else {

                content = `

                    <div class="feedback-type">
                        Unbekannter Datensatz
                    </div>

                    <div class="feedback-text">

                        <p>
                            Die Struktur dieser Rückmeldung
                            konnte nicht eindeutig erkannt werden.
                        </p>

                    </div>
                `;
            }


            return `

                <div class="feedback">

                    <div class="feedback-header">

                        <div class="feedback-top">

                            <div class="feedback-name">
                                ${name}
                            </div>

                            <div class="feedback-date">
                                ${date}
                            </div>

                        </div>

                    </div>

                    ${content}

                </div>
            `;

        }).join("");
}


// ==========================================
// HTML ESCAPEN
// ==========================================

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// LOGIN-STATUS
// ==========================================

function showLoginStatus(message, type) {

    if (!loginStatus) {
        return;
    }


    loginStatus.textContent = message;

    loginStatus.className =
        `status-message ${type}`;

    loginStatus.style.display =
        "block";
}


// ==========================================
// LOGOUT
// ==========================================

if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        accessToken = null;


        if (adminSection) {
            adminSection.style.display = "none";
        }

        if (loginSection) {
            loginSection.style.display = "block";
        }

        if (loginForm) {
            loginForm.reset();
        }

        if (loginStatus) {
            loginStatus.textContent = "";
            loginStatus.style.display = "none";
        }
    });
}


// ==========================================
// AKTUALISIEREN
// ==========================================

if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        loadFeedback
    );
}


// ==========================================
// ALLE FEEDBACKS LÖSCHEN
// ==========================================

const deleteAllButton =
    document.getElementById("deleteAllButton");


if (deleteAllButton) {

    deleteAllButton.addEventListener(
        "click",
        async () => {

            if (!accessToken) {
                return;
            }


            const confirmed =
                confirm(
                    "Möchtest du wirklich alle Rückmeldungen löschen?"
                );


            if (!confirmed) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `${SUPABASE_URL}/rest/v1/feedback?id=not.is.null`,
                        {
                            method: "DELETE",

                            headers: {
                                "apikey": SUPABASE_KEY,
                                "Authorization":
                                    `Bearer ${accessToken}`
                            }
                        }
                    );


                if (!response.ok) {
                    throw new Error(
                        "Die Rückmeldungen konnten nicht gelöscht werden."
                    );
                }


                await loadFeedback();


            } catch (error) {

                console.error(
                    "Fehler beim Löschen:",
                    error
                );

                alert(
                    "Die Rückmeldungen konnten nicht gelöscht werden."
                );
            }
        }
    );
}