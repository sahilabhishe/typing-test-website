// State variables
let testDuration = 0;
let timeRemaining = 0;
let timerInterval = null;
let isPaused = false;
let testStarted = false;
let testFinished = false;
let backspaceCount = 0;
let corrections = 0;
let mistakes = 0;
let startTime = null;
let elapsedTime = 0;

// English Dictionary (Free Source - Common English Words)
const englishDictionary = [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
    'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
    'is', 'are', 'was', 'were', 'been', 'being', 'has', 'had', 'does', 'did',
    'doing', 'would', 'should', 'could', 'might', 'must', 'shall', 'having', 'very', 'more',
    'most', 'too', 'same', 'such', 'no', 'nor', 'not', 'here', 'there', 'where',
    'when', 'why', 'how', 'all', 'each', 'every', 'both', 'either', 'neither', 'few',
    'some', 'any', 'many', 'much', 'more', 'most', 'several', 'another', 'other', 'others',
    'same', 'different', 'such', 'alone', 'own', 'dear', 'best', 'better', 'bad', 'worse',
    'worst', 'new', 'old', 'young', 'long', 'short', 'big', 'small', 'great', 'high',
    'low', 'easy', 'hard', 'difficult', 'simple', 'common', 'possible', 'probable', 'sure', 'certain',
    'able', 'full', 'empty', 'active', 'early', 'late', 'right', 'wrong', 'true', 'false'
];

// Check if word is spelled correctly
function isWordSpelledCorrectly(word) {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    return englishDictionary.includes(cleanWord);
}

// Select test duration
function selectTime(minutes) {
    testDuration = minutes * 60;
    timeRemaining = testDuration;
    startTest();
}

// Start the typing test
function startTest() {
    document.getElementById('timeSelectionScreen').classList.remove('active');
    document.getElementById('typingScreen').classList.add('active');
    
    const typingInput = document.getElementById('typingInput');
    typingInput.focus();
    
    testStarted = true;
    testFinished = false;
    isPaused = false;
    startTime = Date.now();
    elapsedTime = 0;
    backspaceCount = 0;
    corrections = 0;
    mistakes = 0;
    
    // Start timer
    startTimer();
    
    // Add event listeners
    typingInput.addEventListener('input', updateStats);
    typingInput.addEventListener('keydown', handleKeydown);
}

// Timer function
function startTimer() {
    timerInterval = setInterval(() => {
        if (!isPaused) {
            timeRemaining--;
            elapsedTime++;
            updateTimerDisplay();
            
            if (timeRemaining <= 0) {
                finishTest();
            }
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Handle keyboard events
function handleKeydown(e) {
    if (e.key === 'Backspace') {
        backspaceCount++;
        corrections++;
    }
}

// Update statistics
function updateStats() {
    const typingInput = document.getElementById('typingInput');
    const text = typingInput.value;
    
    // Count characters and words
    const charCount = text.length;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    
    // Update character count display
    document.getElementById('charCount').textContent = 
        `Characters: ${charCount} | Words: ${wordCount}`;
    
    // Calculate WPM
    const timeInMinutes = elapsedTime / 60;
    const wpm = timeInMinutes > 0 ? Math.round(wordCount / timeInMinutes) : 0;
    document.getElementById('wpm').textContent = wpm;
    
    // Check spelling and calculate mistakes
    calculateMistakes(words);
    
    // Calculate accuracy
    const accuracy = calculateAccuracy(charCount);
}

// Calculate spelling mistakes
function calculateMistakes(words) {
    mistakes = 0;
    words.forEach(word => {
        if (word.length > 0 && !isWordSpelledCorrectly(word)) {
            mistakes++;
        }
    });
    document.getElementById('mistakes').textContent = mistakes;
}

// Calculate accuracy percentage
function calculateAccuracy(charCount) {
    if (charCount === 0) return 100;
    
    const errorCount = corrections + (mistakes * 5); // Weight mistakes more
    const accuracy = Math.max(0, 100 - (errorCount / charCount) * 100);
    const accuracyValue = Math.round(accuracy);
    document.getElementById('accuracy').textContent = accuracyValue + '%';
    
    return accuracyValue;
}

// Pause test
function pauseTest() {
    isPaused = true;
    document.getElementById('pauseScreen').classList.add('active');
}

// Resume test
function resumeTest() {
    isPaused = false;
    document.getElementById('pauseScreen').classList.remove('active');
    document.getElementById('typingInput').focus();
}

// Exit test
function exitTest() {
    clearInterval(timerInterval);
    document.getElementById('pauseScreen').classList.remove('active');
    document.getElementById('typingScreen').classList.remove('active');
    document.getElementById('timeSelectionScreen').classList.add('active');
    resetVariables();
}

// Finish test
function finishTest() {
    clearInterval(timerInterval);
    testFinished = true;
    
    const typingInput = document.getElementById('typingInput');
    const text = typingInput.value;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const charCount = text.length;
    
    // Calculate final statistics
    const timeInMinutes = testDuration / 60;
    const finalWPM = Math.round(wordCount / timeInMinutes);
    const finalAccuracy = calculateAccuracy(charCount);
    
    // Display results
    displayResults(finalWPM, finalAccuracy, words);
}

// Display results
function displayResults(wpm, accuracy, words) {
    const minutes = Math.floor(testDuration / 60);
    const seconds = testDuration % 60;
    
    document.getElementById('resultWPM').textContent = wpm;
    document.getElementById('resultAccuracy').textContent = accuracy + '%';
    document.getElementById('resultTime').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('resultCorrections').textContent = corrections;
    document.getElementById('resultMistakes').textContent = mistakes;
    document.getElementById('resultBackspace').textContent = backspaceCount;
    
    // Show spelling errors
    const errorDetails = document.getElementById('errorDetails');
    const misspelledWords = words.filter(word => !isWordSpelledCorrectly(word));
    
    if (misspelledWords.length > 0) {
        errorDetails.innerHTML = `
            <h4>⚠️ Spelling Mistakes Detected (${misspelledWords.length}):</h4>
            ${misspelledWords.slice(0, 10).map(word => 
                `<div class="error-item">❌ "${word}" - not found in dictionary</div>`
            ).join('')}
            ${misspelledWords.length > 10 ? `<div class="error-item">... and ${misspelledWords.length - 10} more</div>` : ''}
        `;
    } else {
        errorDetails.innerHTML = '<div style="color: #28a745; text-align: center; font-weight: bold;">✅ Perfect! No spelling mistakes detected!</div>';
    }
    
    // Switch screens
    document.getElementById('typingScreen').classList.remove('active');
    document.getElementById('resultsScreen').classList.add('active');
}

// Reset test
function resetTest() {
    resetVariables();
    document.getElementById('resultsScreen').classList.remove('active');
    document.getElementById('timeSelectionScreen').classList.add('active');
}

// Reset all variables
function resetVariables() {
    testDuration = 0;
    timeRemaining = 0;
    timerInterval = null;
    isPaused = false;
    testStarted = false;
    testFinished = false;
    backspaceCount = 0;
    corrections = 0;
    mistakes = 0;
    startTime = null;
    elapsedTime = 0;
    
    document.getElementById('typingInput').value = '';
    document.getElementById('charCount').textContent = 'Characters: 0 | Words: 0';
    document.getElementById('wpm').textContent = '0';
    document.getElementById('accuracy').textContent = '100%';
    document.getElementById('mistakes').textContent = '0';
    document.getElementById('timer').textContent = '00:00';
}
