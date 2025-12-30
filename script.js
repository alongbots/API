// Configuration
const BASE_URL = 'https://apfel-api-nova.onrender.com';
let currentEndpoint = '';
let currentParams = [];

// DOM Elements
const modal = document.getElementById('apiResponseModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const submitBtn = document.getElementById('submitQueryBtn');
const paramsContainer = document.getElementById('apiParamsContainer');
const responsePre = document.getElementById('apiResponseContent');
const endpointDisplay = document.getElementById('apiEndpointDisplay');
const loader = document.getElementById('loader');

// --- Main Logic ---

/**
 * Opens the modal and prepares the input fields
 * @param {string} endpoint - The API route (e.g., '/cardid')
 * @param {Array} params - List of required params (e.g., ['id', 'q'])
 */
function openConsole(endpoint, params = []) {
    currentEndpoint = endpoint;
    currentParams = params;
    
    // Reset Modal
    paramsContainer.innerHTML = '';
    responsePre.innerHTML = '<code>Waiting for request...</code>';
    responsePre.classList.add('d-none');
    endpointDisplay.innerText = `POST ${endpoint}`;

    // Generate Input Fields if params exist
    if (params.length > 0) {
        params.forEach(param => {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-group';
            
            const label = document.createElement('label');
            label.innerText = param + ': ';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `input-${param}`;
            input.placeholder = `Enter ${param}...`;
            input.className = 'api-input';

            wrapper.appendChild(label);
            wrapper.appendChild(input);
            paramsContainer.appendChild(wrapper);
        });
    } else {
        paramsContainer.innerHTML = '<p class="text-muted">No parameters required.</p>';
    }

    // Show Modal
    modal.style.display = 'block';
}

// Close Modal
closeModalBtn.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// Submit Request
submitBtn.onclick = async () => {
    // 1. Build URL
    const url = new URL(BASE_URL + currentEndpoint);
    
    // 2. Add Parameters
    currentParams.forEach(param => {
        const val = document.getElementById(`input-${param}`).value;
        if(val) url.searchParams.append(param, val);
    });

    // 3. UI Updates
    loader.classList.remove('d-none');
    responsePre.classList.add('d-none');
    submitBtn.disabled = true;

    try {
        // 4. Fetch Data
        const res = await fetch(url);
        const data = await res.json();

        // 5. Display Result
        responsePre.querySelector('code').textContent = JSON.stringify(data, null, 2);
        responsePre.classList.remove('d-none');
        
        // Trigger Prism Syntax Highlighting
        Prism.highlightElement(responsePre.querySelector('code'));

    } catch (error) {
        responsePre.querySelector('code').textContent = `Error: ${error.message}`;
        responsePre.classList.remove('d-none');
    } finally {
        loader.classList.add('d-none');
        submitBtn.disabled = false;
    }
};

// --- Music Player Logic ---
const disc = document.querySelector('.disc');
const audio = document.getElementById('music');

if(disc && audio) {
    disc.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(e => console.log("Audio play failed (interaction required):", e));
            disc.classList.add('playing');
        } else {
            audio.pause();
            disc.classList.remove('playing');
        }
    });
}

// DevTools Detector (Optional - kept but made less aggressive)
const checkDevTools = () => {
    const threshold = 160;
    if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
        console.warn("DevTools detected.");
    }
};
setInterval(checkDevTools, 1000);
