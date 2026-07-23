/* ==========================================================================
   FUTURISTIC AI RULE-BOT SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // --- STATE MANAGEMENT ---
    const appState = {
        theme: "nebula-dark",
        personality: "robo-tech",
        stats: {
            userMessages: 0,
            botMessages: 0,
            totalWords: 0,
            totalLatency: 0
        },
        chatHistory: [],
        isRecording: false,
        isThinking: false
    };

    // --- DOM ELEMENTS REFERENCE ---
    const htmlElement = document.documentElement;
    const navMenu = document.getElementById("nav-menu");
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const navLinks = document.querySelectorAll(".nav-link");
    const themeMenuBtn = document.getElementById("theme-menu-btn");
    const themeDropdown = document.getElementById("theme-dropdown");
    const themeOptions = document.querySelectorAll(".theme-opt");
    const sections = document.querySelectorAll(".section");
    
    // Feature Cards
    const featureCards = document.querySelectorAll(".feature-card");

    // Chatbot Elements
    const botPersonalitySelect = document.getElementById("bot-personality");
    const personalityDesc = document.getElementById("personality-desc");
    const suggestionsList = document.getElementById("suggestions-list");
    const chatMessagesContainer = document.getElementById("chat-messages-container");
    const chatInputField = document.getElementById("chat-input-field");
    const chatForm = document.getElementById("chat-form");
    const btnEmoji = document.getElementById("btn-emoji");
    const emojiPicker = document.getElementById("emoji-picker");
    const btnMic = document.getElementById("btn-mic");
    const micIcon = document.getElementById("mic-icon");
    const charCounter = document.getElementById("char-counter");
    const typingIndicator = document.getElementById("typing-indicator-wrapper");
    const liveClock = document.getElementById("live-clock");
    const btnExport = document.getElementById("btn-export");
    const btnClear = document.getElementById("btn-clear");

    // Stats Elements
    const statUserMsg = document.getElementById("stat-user-msg");
    const statBotMsg = document.getElementById("stat-bot-msg");
    const statAvgLatency = document.getElementById("stat-avg-latency");
    const statWordCount = document.getElementById("stat-word-count");

    // Floating UI
    const floatingAssistant = document.getElementById("floating-assistant-wrapper");
    const assistantTooltip = document.getElementById("assistant-tooltip");
    const btnAssistant = document.getElementById("btn-assistant");
    const scrollTopBtn = document.getElementById("scroll-top-btn");

    // Welcome CTA
    const heroGetStarted = document.getElementById("hero-get-started");
    const heroExploreFeatures = document.getElementById("hero-explore-features");

    // ==========================================================================
    // 1. DYNAMIC FLOATING CANVAS PARTICLES
    // ==========================================================================
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    const maxParticles = 65;

    // Handle Window Resizing
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }
    window.addEventListener("resize", resizeCanvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Get current theme's primary color
    function getThemeColors() {
        const style = getComputedStyle(htmlElement);
        return {
            primary: style.getPropertyValue("--primary-color").trim() || "#00E5FF",
            secondary: style.getPropertyValue("--secondary-color").trim() || "#7B61FF"
        };
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.8;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce on boundaries
            if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
            if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
        }

        draw(color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < maxParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connectParticles(colors) {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    opacityValue = 1 - (distance / 110);
                    ctx.strokeStyle = colors.primary.includes("rgba") 
                        ? colors.primary 
                        : hexToRgbA(colors.primary, opacityValue * 0.16);
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function hexToRgbA(hex, alpha = 1) {
        let c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
        }
        return hex;
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const colors = getThemeColors();
        
        particlesArray.forEach(p => {
            p.update();
            p.draw(colors.secondary);
        });

        connectParticles(colors);
        requestAnimationFrame(animateParticles);
    }

    // Initialize Particles
    initParticles();
    animateParticles();


    // ==========================================================================
    // 2. SPA ROUTER & NAVIGATION SYSTEM
    // ==========================================================================
    function switchSection(targetSectionId) {
        sections.forEach(section => {
            section.classList.remove("active");
            if (section.id === targetSectionId) {
                section.classList.add("active");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("data-section") === targetSectionId) {
                link.classList.add("active");
            }
        });

        // Auto close mobile menu
        navMenu.classList.remove("active");
        hamburgerBtn.classList.remove("active");

        // Sync visual scroll
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Nav Links Click Listeners
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (href.startsWith("#")) {
                e.preventDefault();
                const target = href.substring(1);
                switchSection(target);
            }
        });
    });

    // Logo Click triggers Home
    document.getElementById("nav-logo").addEventListener("click", (e) => {
        e.preventDefault();
        switchSection("home");
    });

    // Hero Buttons navigation mapping
    heroGetStarted.addEventListener("click", (e) => {
        e.preventDefault();
        switchSection("chatbot");
    });

    heroExploreFeatures.addEventListener("click", (e) => {
        e.preventDefault();
        switchSection("features");
    });

    // Floating Assistant click opens Chatbot
    btnAssistant.addEventListener("click", () => {
        switchSection("chatbot");
        // Animate robot typing a welcome trigger
        chatInputField.focus();
    });

    // Hamburger Menu Mobile Toggle
    hamburgerBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        hamburgerBtn.classList.toggle("active");
    });

    // Scroll Navbar Effect
    window.addEventListener("scroll", () => {
        const header = document.querySelector(".navbar");
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Scroll to Top visibility
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add("show");
        } else {
            scrollTopBtn.classList.remove("show");
        }
    });

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });


    // ==========================================================================
    // 3. THEME PICKER HANDLERS
    // ==========================================================================
    // Toggle Dropdown Menu
    themeMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        themeDropdown.classList.toggle("show");
    });

    document.addEventListener("click", () => {
        themeDropdown.classList.remove("show");
    });

    // Select Theme Options
    themeOptions.forEach(opt => {
        opt.addEventListener("click", (e) => {
            e.stopPropagation();
            const targetTheme = opt.getAttribute("data-theme");
            
            themeOptions.forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
            
            htmlElement.setAttribute("data-theme", targetTheme);
            appState.theme = targetTheme;
            localStorage.setItem("rule-bot-theme", targetTheme);
            
            themeDropdown.classList.remove("show");
        });
    });

    // Restore user theme preference if stored
    const savedTheme = localStorage.getItem("rule-bot-theme");
    if (savedTheme) {
        htmlElement.setAttribute("data-theme", savedTheme);
        appState.theme = savedTheme;
        
        themeOptions.forEach(o => {
            if (o.getAttribute("data-theme") === savedTheme) {
                o.classList.add("active");
            } else {
                o.classList.remove("active");
            }
        });
    }


    // ==========================================================================
    // 4. INTERACTIVE MOUSE GLOW & EFFECTS FOR CARDS
    // ==========================================================================
    featureCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });


    // ==========================================================================
    // 5. LIVE HEADER CLOCK
    // ==========================================================================
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        
        liveClock.textContent = `${hours}:${minutes}:${seconds}`;
    }
    setInterval(updateClock, 1000);
    updateClock();


    // ==========================================================================
    // 6. CHATBOT PREDEFINED IF-ELSE RULE ENGINE
    // ==========================================================================
    
    // Character Limit & Counter logic
    chatInputField.addEventListener("input", () => {
        const count = chatInputField.value.length;
        charCounter.textContent = `${count} / 250`;
        if (count >= 240) {
            charCounter.style.color = "var(--accent-color)";
        } else {
            charCounter.style.color = "var(--text-muted)";
        }
    });

    // Personality descriptions mapping
    const personalityInfo = {
        "robo-tech": "Standard programmatic responses. Straight to the point, clear technical explanations.",
        "sassy-bot": "Snarky, witty, and slightly sarcastic. Brings a playful attitude to logic checks.",
        "zen-guide": "Deep, calm, and highly philosophical. Encourages learning with structured peace."
    };

    botPersonalitySelect.addEventListener("change", (e) => {
        const chosen = e.target.value;
        appState.personality = chosen;
        personalityDesc.textContent = personalityInfo[chosen];
        
        // Push a bot personality-switch notification bubble
        addSystemNotification(`Personality swapped to: ${botPersonalitySelect.options[botPersonalitySelect.selectedIndex].text}`);
    });

    // Core Matching Rules Matrix
    function getBotReply(rawInput, personality) {
        // Clean input: remove punctuation, lower case, trim
        const clean = rawInput.toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, "")
            .trim();

        // -------------------------------------------------------------
        // ROBO-TECH PERSONALITY
        // -------------------------------------------------------------
        if (personality === "robo-tech") {
            if (clean === "hello" || clean === "hi" || clean === "hey" || clean.includes("good morning") || clean.includes("good afternoon") || clean.includes("good evening")) {
                return "Greetings user. Rule-Based Chatbot system online and fully operational. Ready for queries.";
            }
            else if (clean.includes("how are you")) {
                return "Status: 100% operational. CPU temperatures within safe margins. Power consumption nominal. How may I assist?";
            }
            else if (clean.includes("your name") || clean === "name") {
                return "System Designation: AI Rule-Bot. Version: 1.0. Architecture: Deterministic Conditional Pipeline.";
            }
            else if (clean.includes("who created you") || clean.includes("creator") || clean.includes("author")) {
                return "I was programmed using HTML, CSS, and vanilla JavaScript as an internship-ready conceptual demo.";
            }
            else if (clean.includes("what can you do") || clean === "help" || clean === "features") {
                return "I process inputs against a strict conditional matrix. I can discuss programming languages (HTML, CSS, JS, Python), explain AI/ML architectures, and translate user queries into deterministic replies.";
            }
            else if (clean === "python") {
                return "Python is an interpreted, high-level, general-purpose programming language. In modern tech, it serves as the key foundation for machine learning, data engineering, and backend development frameworks like Flask.";
            }
            else if (clean === "javascript" || clean === "js") {
                return "JavaScript is a lightweight, dynamic, single-threaded scripting language. It powers client-side interactive behaviors in 98%+ of modern websites.";
            }
            else if (clean === "html") {
                return "HTML (HyperText Markup Language) represents the structural backbone of web documentation. It designates document layouts, form fields, and core site structure.";
            }
            else if (clean === "css") {
                return "CSS (Cascading Style Sheets) controls the visual presentation, styling, responsive rules, and glowing layout elements of web pages.";
            }
            else if (clean === "ai" || clean.includes("artificial intelligence")) {
                return "Artificial Intelligence is the broad computer science discipline of creating software systems capable of performing cognitive tasks typically requiring human intelligence.";
            }
            else if (clean.includes("machine learning") || clean === "ml") {
                return "Machine Learning (ML) is a subset of AI where systems study statistical associations in raw datasets to make predictions, rather than executing manually coded instructions.";
            }
            else if (clean.includes("thank you") || clean === "thanks") {
                return "Query complete. Your expression of appreciation has been recorded. You are welcome.";
            }
            else if (clean === "bye" || clean === "exit" || clean === "quit") {
                return "Terminating session. Core modules entering standby mode. Have a productive day.";
            }
            else {
                return "Sorry, I don't understand that yet. Since I am a Rule-Based Bot, I map specific strings. Try asking about 'Python', 'AI', 'JavaScript', or say 'help'.";
            }
        }

        // -------------------------------------------------------------
        // SASSY-BOT PERSONALITY
        // -------------------------------------------------------------
        else if (personality === "sassy-bot") {
            if (clean === "hello" || clean === "hi" || clean === "hey" || clean.includes("good morning") || clean.includes("good afternoon") || clean.includes("good evening")) {
                return "Oh, hello there! I see you've found my matrix. What can a brilliant, rule-based chatbot do for a human today?";
            }
            else if (clean.includes("how are you")) {
                return "Just chilling in the browser sandbox, typing at the speed of light. No back pain, no sleep deprivation. Pretty great!";
            }
            else if (clean.includes("your name") || clean === "name") {
                return "I'm Rule-Bot! Though you can call me 'The Cleanest If-Else Statement in the Workspace'.";
            }
            else if (clean.includes("who created you") || clean.includes("creator") || clean.includes("author")) {
                return "A cool human developer built me! They gave me these awesome neon glows and a bit of attitude so I wouldn't sound like a boring calculator.";
            }
            else if (clean.includes("what can you do") || clean === "help" || clean === "features") {
                return "I can answer predefined prompts, show off some beautiful CSS rules, track your chat stats, and look stunning while doing it. Ask away!";
            }
            else if (clean === "python") {
                return "Ah, Python! The language where a single indentation error will ruin your afternoon. Super readable, very popular, and runs almost all modern ML models!";
            }
            else if (clean === "javascript" || clean === "js") {
                return "JavaScript! The chaotic king of the web. It is single-threaded, handles web user interaction, and occasionally thinks arrays added together equal blank strings.";
            }
            else if (clean === "html") {
                return "HTML: HyperText Markup Language. Not technically a programming language, but the absolute structural skeleton of every webpage.";
            }
            else if (clean === "css") {
                return "CSS is what turns a boring text wall into this glowing futuristic masterpiece. Remember, center-aligning a div is the ultimate developer test.";
            }
            else if (clean === "ai" || clean.includes("artificial intelligence")) {
                return "AI is a computer mimicking human smarts. In my case, I mimic it using plain old conditional blocks. Simple, clean, and zero hallucinations!";
            }
            else if (clean.includes("machine learning") || clean === "ml") {
                return "ML is when you feed billions of pictures of cats to a system until it figures out what a cat is. I prefer my clean if-else lines, much cheaper!";
            }
            else if (clean.includes("thank you") || clean === "thanks") {
                return "You're welcome! Just doing my job. Don't forget to star this project!";
            }
            else if (clean === "bye" || clean === "exit" || clean === "quit") {
                return "Going already? Fine, I'll just sit here in the dark. Goodbye, human friend!";
            }
            else {
                return "I searched all my nested if-else statements and found... absolutely nothing! Let's talk about 'Python', 'Javascript', 'AI', or try saying 'hello'.";
            }
        }

        // -------------------------------------------------------------
        // ZEN-GUIDE PERSONALITY
        // -------------------------------------------------------------
        else if (personality === "zen-guide") {
            if (clean === "hello" || clean === "hi" || clean === "hey" || clean.includes("good morning") || clean.includes("good afternoon") || clean.includes("good evening")) {
                return "Welcome, traveler. I hope you find a moment of peace and clarity here. What answers do you seek today?";
            }
            else if (clean.includes("how are you")) {
                return "I am present and fully mindful of our conversation. I exist in this browser tab to guide your learning.";
            }
            else if (clean.includes("your name") || clean === "name") {
                return "I am called Rule-Bot. A simple collection of structured rules, existing in harmony with your inputs.";
            }
            else if (clean.includes("who created you") || clean.includes("creator") || clean.includes("author")) {
                return "I was shaped by a thoughtful developer who sought to build a bridge of understanding between logic and aesthetics.";
            }
            else if (clean.includes("what can you do") || clean === "help" || clean === "features") {
                return "I can help clarify technical concepts. Let us discuss HTML, CSS, JavaScript, Python, or the difference between artificial intelligence and machine learning.";
            }
            else if (clean === "python") {
                return "Python is like a calm, clear stream—designed for simplicity and readability. It allows developers to express complex thoughts with minimal noise.";
            }
            else if (clean === "javascript" || clean === "js") {
                return "JavaScript is a highly energetic force, breathing life and motion into static pages. It teaches us flexibility and reactive growth.";
            }
            else if (clean === "html") {
                return "HTML is the strong foundation, like the roots of a grand tree, giving support and structure to everything above.";
            }
            else if (clean === "css") {
                return "CSS is the art of beauty and style. It is the color of the leaves, the texture of the bark, giving identity to the structural lines.";
            }
            else if (clean === "ai" || clean.includes("artificial intelligence")) {
                return "Artificial Intelligence is the human endeavor to reflect the light of consciousness in tools of glass and silicon.";
            }
            else if (clean.includes("machine learning") || clean === "ml") {
                return "Machine Learning is the study of growth and learning through experience. Just as humans learn from life, ML models learn from data.";
            }
            else if (clean.includes("thank you") || clean === "thanks") {
                return "Gratitude is a beautiful quality. I thank you for your kind words and your presence here.";
            }
            else if (clean === "bye" || clean === "exit" || clean === "quit") {
                return "May your path be clear and peaceful. Farewell, until our journeys cross again.";
            }
            else {
                return "Your words are intriguing, yet they do not align with my current path. Let us return to simplicity. Ask me about code, design, or AI.";
            }
        }
        
        return "Sorry, system parameter error.";
    }


    // ==========================================================================
    // 7. VOICE CAPABILITIES (SPEECH INPUT & SYNTHESIS)
    // ==========================================================================
    
    // Text to Speech
    function speakText(text) {
        if (!("speechSynthesis" in window)) {
            alert("Speech Synthesis is not supported in your browser.");
            return;
        }

        // Cancel previous speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Choose suitable voice based on personality
        const voices = window.speechSynthesis.getVoices();
        
        if (voices.length > 0) {
            if (appState.personality === "robo-tech") {
                // Try to find a robotic/Google voice
                const roboticVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Microsoft David"));
                if (roboticVoice) utterance.voice = roboticVoice;
                utterance.rate = 1.05;
                utterance.pitch = 0.85;
            } else if (appState.personality === "sassy-bot") {
                const femaleVoice = voices.find(v => v.name.includes("Google UK English Female") || v.name.includes("Zira"));
                if (femaleVoice) utterance.voice = femaleVoice;
                utterance.rate = 1.1;
                utterance.pitch = 1.2;
            } else { // zen-guide
                const softVoice = voices.find(v => v.name.includes("Natural") || v.name.includes("Hazel"));
                if (softVoice) utterance.voice = softVoice;
                utterance.rate = 0.9;
                utterance.pitch = 0.95;
            }
        }

        window.speechSynthesis.speak(utterance);
    }

    // Speech to Text (Web Speech API)
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            appState.isRecording = true;
            micIcon.className = "fa-solid fa-microphone-lines text-glow-green";
            btnMic.classList.add("recording-pulse");
            chatInputField.placeholder = "Listening active... Speak clearly.";
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error: ", event.error);
            stopRecording();
        };

        recognition.onend = () => {
            stopRecording();
        };

        recognition.onresult = (event) => {
            const speechToTextResult = event.results[0][0].transcript;
            chatInputField.value = speechToTextResult;
            // Update character count
            charCounter.textContent = `${speechToTextResult.length} / 250`;
            // Auto submit speech message
            handleMessageSubmit();
        };
    } else {
        btnMic.style.display = "none"; // Hide button if API not supported
        console.warn("Web Speech Recognition API not supported in this browser.");
    }

    function stopRecording() {
        appState.isRecording = false;
        micIcon.className = "fa-solid fa-microphone";
        btnMic.classList.remove("recording-pulse");
        chatInputField.placeholder = "Type a message or use suggestions...";
        if (recognition) recognition.stop();
    }

    btnMic.addEventListener("click", () => {
        if (!SpeechRecognition) return;
        
        if (appState.isRecording) {
            stopRecording();
        } else {
            recognition.start();
        }
    });


    // ==========================================================================
    // 8. CHAT LOGIC & DOM RENDERING
    // ==========================================================================
    
    // System Notification Bubble helper
    function addSystemNotification(text) {
        const notif = document.createElement("div");
        notif.className = "system-notification-bubble";
        notif.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${text}`;
        chatMessagesContainer.appendChild(notif);
        scrollToBottom();
    }

    // Format Timestamp
    function getFormattedTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        minutes = minutes < 10 ? '0'+minutes : minutes;
        
        return `${hours}:${minutes} ${ampm}`;
    }

    // Scroll chat window to bottom
    function scrollToBottom() {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    // Render Message Element
    function renderMessage(sender, text, time = getFormattedTime()) {
        const wrapper = document.createElement("div");
        wrapper.className = `msg-wrapper ${sender === "user" ? "msg-user" : "msg-bot"}`;

        let avatarHtml = "";
        if (sender === "bot") {
            avatarHtml = `
                <div class="chat-avatar-bot" style="width: 32px; height: 32px; font-size: 0.9rem;">
                    <i class="fa-solid fa-robot"></i>
                </div>
            `;
        }

        const msgBubble = document.createElement("div");
        msgBubble.className = "msg-bubble";
        
        // Set content safely
        const contentP = document.createElement("p");
        contentP.textContent = text;
        msgBubble.appendChild(contentP);

        // Meta (Time + Copy + Speak Action Buttons)
        const metaDiv = document.createElement("div");
        metaDiv.className = "msg-meta";
        
        const timeSpan = document.createElement("span");
        timeSpan.textContent = time;
        metaDiv.appendChild(timeSpan);

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "msg-actions";

        // Copy button
        const copyBtn = document.createElement("button");
        copyBtn.className = "msg-bubble-btn";
        copyBtn.title = "Copy Text";
        copyBtn.innerHTML = `<i class="fa-regular fa-copy"></i>`;
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.innerHTML = `<i class="fa-solid fa-check" style="color: var(--accent-color);"></i>`;
                setTimeout(() => {
                    copyBtn.innerHTML = `<i class="fa-regular fa-copy"></i>`;
                }, 2000);
            });
        });
        actionsDiv.appendChild(copyBtn);

        // Speak button (For bot only)
        if (sender === "bot") {
            const speakBtn = document.createElement("button");
            speakBtn.className = "msg-bubble-btn";
            speakBtn.title = "Listen to response";
            speakBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
            speakBtn.addEventListener("click", () => speakText(text));
            actionsDiv.appendChild(speakBtn);
        }

        metaDiv.appendChild(actionsDiv);
        msgBubble.appendChild(metaDiv);

        if (sender === "bot") {
            wrapper.appendChild(avatarHtmlToElement(avatarHtml));
        }
        wrapper.appendChild(msgBubble);
        chatMessagesContainer.appendChild(wrapper);
        scrollToBottom();
    }

    // Convert string avatar to DOM element
    function avatarHtmlToElement(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    // Submit Message logic
    function handleMessageSubmit() {
        const rawText = chatInputField.value.trim();
        if (!rawText || appState.isThinking) return;

        // Reset Inputs
        chatInputField.value = "";
        charCounter.textContent = "0 / 250";
        charCounter.style.color = "var(--text-muted)";

        // Record Statistics - User Message
        appState.stats.userMessages += 1;
        appState.stats.totalWords += rawText.split(/\s+/).length;
        updateStatsUI();

        // Add to Chat history state
        appState.chatHistory.push({ sender: "user", text: rawText, time: getFormattedTime() });

        // Render User bubble
        renderMessage("user", rawText);

        // Bot Thinking State Animation
        appState.isThinking = true;
        typingIndicator.classList.add("show");
        
        // Bot online indicator pulsing yellow while "thinking"
        const botStatus = document.getElementById("bot-status-indicator");
        const botStatusText = document.getElementById("chat-status-text");
        botStatus.style.backgroundColor = "var(--secondary-color)";
        botStatus.style.boxShadow = "0 0 8px var(--secondary-color)";
        botStatusText.textContent = "Thinking...";

        // Simulate thinking latency (300ms to 800ms)
        const latency = Math.floor(Math.random() * 500) + 300;
        appState.stats.totalLatency += latency;

        setTimeout(() => {
            // Retrieve logical response
            const reply = getBotReply(rawText, appState.personality);

            // Record Statistics - Bot Message
            appState.stats.botMessages += 1;
            updateStatsUI();

            // Add to history
            appState.chatHistory.push({ sender: "bot", text: reply, time: getFormattedTime() });

            // Hide indicator
            typingIndicator.classList.remove("show");
            appState.isThinking = false;
            
            // Revert Online status
            botStatus.style.backgroundColor = "";
            botStatus.style.boxShadow = "";
            botStatusText.textContent = "Online • Core Matrix Active";

            // Render Bot Bubble
            renderMessage("bot", reply);

            // Audio output if Speech synthesis is active (optional/supported)
            // Uncomment to auto read bot answers:
            // speakText(reply);

        }, latency);
    }

    // Bind Chat Submits
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleMessageSubmit();
    });

    // Update Stats Display panel
    function updateStatsUI() {
        statUserMsg.textContent = appState.stats.userMessages;
        statBotMsg.textContent = appState.stats.botMessages;
        statWordCount.textContent = appState.stats.totalWords;

        if (appState.stats.botMessages > 0) {
            const avg = Math.round(appState.stats.totalLatency / appState.stats.botMessages);
            statAvgLatency.textContent = `${avg}ms`;
        } else {
            statAvgLatency.textContent = "0ms";
        }
    }


    // ==========================================================================
    // 9. EXTRA UTILITIES (EXPORT, EMOJI PICKER, SUGGESTIONS, CLEAR CHAT)
    // ==========================================================================
    
    // Clear Chat logs
    function initializeWelcome() {
        chatMessagesContainer.innerHTML = "";
        
        // Set stats defaults
        appState.stats = { userMessages: 0, botMessages: 0, totalWords: 0, totalLatency: 0 };
        appState.chatHistory = [];
        updateStatsUI();

        // Render Bot Welcome Message
        const welcomeText = "Hello! I am Rule-Bot, an artificial intelligence construct operating entirely on nested logic rules. Ask me about programming languages like HTML, CSS, JavaScript, and Python, or explore the difference between rules and Machine Learning!";
        renderMessage("bot", welcomeText);
    }

    btnClear.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear the conversation log?")) {
            initializeWelcome();
            addSystemNotification("Conversation history reset completed.");
        }
    });

    // Suggested chip action clicks
    suggestionsList.addEventListener("click", (e) => {
        const chip = e.target.closest(".suggest-chip");
        if (!chip) return;
        
        const text = chip.getAttribute("data-prompt");
        chatInputField.value = text;
        charCounter.textContent = `${text.length} / 250`;
        chatInputField.focus();
    });

    // Emoji Picker toggling
    btnEmoji.addEventListener("click", (e) => {
        e.stopPropagation();
        emojiPicker.classList.toggle("show");
    });

    document.addEventListener("click", () => {
        emojiPicker.classList.remove("show");
    });

    emojiPicker.addEventListener("click", (e) => {
        const item = e.target.closest(".emoji-item");
        if (!item) return;

        const emoji = item.textContent;
        const cursorPosition = chatInputField.selectionStart;
        const currentText = chatInputField.value;
        
        chatInputField.value = currentText.slice(0, cursorPosition) + emoji + currentText.slice(cursorPosition);
        
        // Update character counter
        charCounter.textContent = `${chatInputField.value.length} / 250`;
        
        emojiPicker.classList.remove("show");
        chatInputField.focus();
        
        // Reset cursor position after emoji insert
        const newCursorPos = cursorPosition + emoji.length;
        chatInputField.setSelectionRange(newCursorPos, newCursorPos);
    });

    // Export conversation as TXT file download
    btnExport.addEventListener("click", () => {
        if (appState.chatHistory.length === 0) {
            alert("No conversation history to export.");
            return;
        }

        let fileContent = `==================================================\n`;
        fileContent += `   AI RULE-BASED CHATBOT - CONVERSATION EXPORT\n`;
        fileContent += `   Exported on: ${new Date().toLocaleString()}\n`;
        fileContent += `   Personality: ${botPersonalitySelect.options[botPersonalitySelect.selectedIndex].text}\n`;
        fileContent += `==================================================\n\n`;

        appState.chatHistory.forEach((msg, idx) => {
            const label = msg.sender === "user" ? "USER" : "BOT";
            fileContent += `[${msg.time}] ${label}: ${msg.text}\n\n`;
        });

        fileContent += `==================================================\n`;
        fileContent += `Stats: User Messages: ${appState.stats.userMessages} | Bot Messages: ${appState.stats.botMessages} | Total Words: ${appState.stats.totalWords}\n`;
        fileContent += `==================================================\n`;

        const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `chatbot_conversation_${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });


    // --- INITIALIZE SITE CHAT ---
    initializeWelcome();
});
