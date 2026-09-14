// ==========================================
// SUPABASE KONFIGURATION
// ==========================================

const SUPABASE_URL =
    "DEINE_SUPABASE_URL";

const SUPABASE_KEY =
    "DEIN_SUPABASE_PUBLISHABLE_KEY";


// ==========================================
// COOKIE
// ==========================================

const CLIENT_COOKIE_NAME =
    "feedback_system_client_id";


// ==========================================
// DOM-ELEMENTE
// ==========================================

const feedbackForm = document.getElementById("feedbackForm");

const participation = document.getElementById("participation");
const nameInput = document.getElementById("name");

const notParticipatedForm =
    document.getElementById("notParticipatedForm");

const reason = document.getElementById("reason");
const additionalTextGroup =
    document.getElementById("additionalTextGroup");

const additionalText =
    document.getElementById("additionalText");

const participatedForm =
    document.getElementById("participatedForm");

const overallRating =
    document.getElementById("overall_rating");

const difficulty =
    document.getElementById("difficulty");

const lengthRating =
    document.getElementById("length_rating");

const clueClarity =
    document.getElementById("clue_clarity");

const varietyRating =
    document.getElementById("variety_rating");

const funRating =
    document.getElementById("fun_rating");

const positiveFeedback =
    document.getElementById("positive_feedback");

const improvementFeedback =
    document.getElementById("improvement_feedback");

const additionalFeedback =
    document.getElementById("additional_feedback");

const submitButton =
    document.getElementById("submitButton");

const statusMessage =
    document.getElementById("statusMessage");


// ==========================================
// COOKIE-FUNKTIONEN
// ==========================================

function getCookie(name) {

    const cookies = document.cookie.split("; ");

    for (const cookie of cookies) {

        const [key, value] = cookie.split("=");

        if (key === name) {
            return decodeURIComponent(value);
        }
    }

    return null;
}


function createClientId() {

    const clientId = crypto.randomUUID();

    document.cookie =
        `${CLIENT_COOKIE_NAME}=${encodeURIComponent(clientId)}; ` +
        `max-age=${60 * 60 * 24 * 365}; ` +
        `path=/; ` +
        `SameSite=Lax; ` +
        `Secure`;

    return clientId;
}


function getOrCreateClientId() {

    const existingClientId =
        getCookie(CLIENT_COOKIE_NAME);

    if (existingClientId) {
        return existingClientId;
    }

    return createClientId();
}


// ==========================================
// INITIALER ZUSTAND
// ==========================================

if (notParticipatedForm) {
    notParticipatedForm.classList.add("hidden");
    notParticipatedForm.style.display = "none";
}

if (participatedForm) {
    participatedForm.classList.add("hidden");
    participatedForm.style.display = "none";
}

if (additionalTextGroup) {
    additionalTextGroup.classList.add("hidden");
    additionalTextGroup.style.display = "none";
}


// ==========================================
// TEILNAHME AUSWÄHLEN
// ==========================================

if (participation) {

    participation.addEventListener("change", () => {

        const value = participation.value;


        if (value === "Teilgenommen") {

            if (participatedForm) {
                participatedForm.classList.remove("hidden");
                participatedForm.style.display = "";
            }

            if (notParticipatedForm) {
                notParticipatedForm.classList.add("hidden");
                notParticipatedForm.style.display = "none";
            }


            const requiredFields = [
                overallRating,
                difficulty,
                lengthRating,
                clueClarity,
                varietyRating,
                funRating
            ];

            requiredFields.forEach(field => {

                if (field) {
                    field.required = true;
                }
            });


            if (reason) {
                reason.required = false;
                reason.value = "";
            }

            if (additionalText) {
                additionalText.required = false;
                additionalText.value = "";
            }

            if (additionalTextGroup) {
                additionalTextGroup.classList.add("hidden");
                additionalTextGroup.style.display = "none";
            }

        } else if (value === "Nicht teilgenommen") {

            if (notParticipatedForm) {
                notParticipatedForm.classList.remove("hidden");
                notParticipatedForm.style.display = "";
            }

            if (participatedForm) {
                participatedForm.classList.add("hidden");
                participatedForm.style.display = "none";
            }


            const participantFields = [
                overallRating,
                difficulty,
                lengthRating,
                clueClarity,
                varietyRating,
                funRating
            ];

            participantFields.forEach(field => {

                if (field) {
                    field.required = false;
                    field.value = "";
                }
            });


            if (reason) {
                reason.required = true;
            }

            if (additionalText) {
                additionalText.required = false;
                additionalText.value = "";
            }

            if (additionalTextGroup) {
                additionalTextGroup.classList.add("hidden");
                additionalTextGroup.style.display = "none";
            }

            if (positiveFeedback) {
                positiveFeedback.value = "";
            }

            if (improvementFeedback) {
                improvementFeedback.value = "";
            }

            if (additionalFeedback) {
                additionalFeedback.value = "";
            }
        }
    });
}


// ==========================================
// GRUND AUSWÄHLEN
// ==========================================

if (reason) {

    reason.addEventListener("change", () => {

        if (reason.value === "Sonstige") {

            if (additionalTextGroup) {
                additionalTextGroup.classList.remove("hidden");
                additionalTextGroup.style.display = "";
            }

            if (additionalText) {
                additionalText.required = true;
            }

        } else {

            if (additionalTextGroup) {
                additionalTextGroup.classList.add("hidden");
                additionalTextGroup.style.display = "none";
            }

            if (additionalText) {
                additionalText.required = false;
                additionalText.value = "";
            }
        }
    });
}


// ==========================================
// FORMULAR ABSENDEN
// ==========================================

if (feedbackForm) {

    feedbackForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (!participation || !participation.value) {

            showStatus(
                "Bitte wähle aus, ob du teilgenommen hast.",
                "error"
            );

            return;
        }


        submitButton.disabled = true;


        try {

            let feedback;


            // ==================================
            // NICHT TEILGENOMMEN
            // ==================================

            if (participation.value === "Nicht teilgenommen") {

                if (!reason || !reason.value) {

                    showStatus(
                        "Bitte wähle einen Grund aus.",
                        "error"
                    );

                    submitButton.disabled = false;
                    return;
                }


                if (
                    reason.value === "Sonstige" &&
                    (!additionalText || !additionalText.value.trim())
                ) {

                    showStatus(
                        "Bitte beschreibe den Grund näher.",
                        "error"
                    );

                    submitButton.disabled = false;
                    return;
                }


                feedback = {

                    name: nameInput
                        ? nameInput.value.trim() || null
                        : null,

                    participated: false,

                    reason: reason.value,

                    additional_text:
                        additionalText
                            ? additionalText.value.trim() || null
                            : null,

                    overall_rating: null,
                    difficulty: null,
                    length_rating: null,
                    clue_clarity: null,
                    variety_rating: null,
                    fun_rating: null,

                    positive_feedback: null,
                    improvement_feedback: null,
                    additional_feedback: null
                };


                // ==================================
                // TEILGENOMMEN
                // ==================================

            } else {

                const requiredFields = [
                    overallRating,
                    difficulty,
                    lengthRating,
                    clueClarity,
                    varietyRating,
                    funRating
                ];


                const incomplete =
                    requiredFields.some(
                        field => !field || !field.value
                    );


                if (incomplete) {

                    showStatus(
                        "Bitte beantworte alle Pflichtfragen.",
                        "error"
                    );

                    submitButton.disabled = false;
                    return;
                }


                feedback = {

                    name: nameInput
                        ? nameInput.value.trim() || null
                        : null,

                    participated: true,

                    reason: null,
                    additional_text: null,

                    overall_rating: overallRating.value,
                    difficulty: difficulty.value,
                    length_rating: lengthRating.value,
                    clue_clarity: clueClarity.value,
                    variety_rating: varietyRating.value,
                    fun_rating: funRating.value,

                    positive_feedback:
                        positiveFeedback
                            ? positiveFeedback.value.trim() || null
                            : null,

                    improvement_feedback:
                        improvementFeedback
                            ? improvementFeedback.value.trim() || null
                            : null,

                    additional_feedback:
                        additionalFeedback
                            ? additionalFeedback.value.trim() || null
                            : null
                };
            }


            await submitFeedback(feedback);


        } catch (error) {

            console.error("Fehler beim Absenden:", error);

            showStatus(
                "Beim Absenden ist ein Fehler aufgetreten. Bitte versuche es erneut.",
                "error"
            );

            submitButton.disabled = false;
        }
    });
}


// ==========================================
// FEEDBACK-SLOT RESERVIEREN
// ==========================================

async function reserveFeedbackSlot(clientId) {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/feedback_submissions`,
        {
            method: "POST",

            headers: {
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },

            body: JSON.stringify({
                client_id: clientId
            })
        }
    );


    if (response.status === 409) {

        throw new Error(
            "Dieses Gerät hat bereits eine Rückmeldung abgegeben."
        );
    }


    if (!response.ok) {

        const errorText =
            await response.text();

        console.error(
            "Fehler beim Reservieren:",
            errorText
        );

        throw new Error(
            "Der Feedback-Slot konnte nicht reserviert werden."
        );
    }
}


// ==========================================
// RESERVIERUNG FREIGEBEN
// ==========================================

async function releaseFeedbackSlot(clientId) {

    try {

        await fetch(
            `${SUPABASE_URL}/rest/v1/feedback_submissions?client_id=eq.${encodeURIComponent(clientId)}`,
            {
                method: "DELETE",

                headers: {
                    "apikey": SUPABASE_KEY
                }
            }
        );

    } catch (error) {

        console.error(
            "Fehler beim Freigeben des Slots:",
            error
        );
    }
}


// ==========================================
// FEEDBACK ABSENDEN
// ==========================================

async function submitFeedback(feedback) {

    const clientId =
        getOrCreateClientId();


    await reserveFeedbackSlot(clientId);


    try {

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/feedback`,
            {
                method: "POST",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },

                body: JSON.stringify(feedback)
            }
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Supabase-Fehler:",
                errorText
            );

            throw new Error(
                "Die Rückmeldung konnte nicht gespeichert werden."
            );
        }


        // ==================================
        // ERFOLGREICH
        // ==================================

        feedbackForm.reset();


        if (participatedForm) {
            participatedForm.classList.add("hidden");
            participatedForm.style.display = "none";
        }

        if (notParticipatedForm) {
            notParticipatedForm.classList.add("hidden");
            notParticipatedForm.style.display = "none";
        }

        if (additionalTextGroup) {
            additionalTextGroup.classList.add("hidden");
            additionalTextGroup.style.display = "none";
        }


        if (submitButton) {
            submitButton.disabled = false;
        }


        showStatus(
            "Vielen Dank für deine Rückmeldung.",
            "success"
        );


    } catch (error) {

        await releaseFeedbackSlot(clientId);

        throw error;
    }
}


// ==========================================
// STATUSMELDUNG
// ==========================================

function showStatus(message, type) {

    if (!statusMessage) {
        return;
    }


    statusMessage.textContent = message;

    statusMessage.className =
        `status-message ${type}`;


    statusMessage.style.display = "block";
}