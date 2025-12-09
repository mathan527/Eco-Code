// Monaco Editor Integration
let monacoEditor = null;

function initializeEditor() {
    require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
    
    require(['vs/editor/editor.main'], function () {
        const editorContainer = document.getElementById('codeEditor');
        
        if (!editorContainer) return;

        // Patch KeyboardEvent to fix Monaco editor keyboard errors
        const originalAddEventListener = HTMLElement.prototype.addEventListener;
        HTMLElement.prototype.addEventListener = function(type, listener, options) {
            if (type === 'keydown' || type === 'keyup' || type === 'keypress') {
                const wrappedListener = function(event) {
                    // Ensure getModifierState exists
                    if (!event.getModifierState) {
                        event.getModifierState = function(key) {
                            const modifiers = {
                                'Alt': event.altKey,
                                'Control': event.ctrlKey,
                                'Meta': event.metaKey,
                                'Shift': event.shiftKey
                            };
                            return modifiers[key] || false;
                        };
                    }
                    return listener.call(this, event);
                };
                return originalAddEventListener.call(this, type, wrappedListener, options);
            }
            return originalAddEventListener.call(this, type, listener, options);
        };

        monacoEditor = monaco.editor.create(editorContainer, {
            value: getSampleCode('python'),
            language: 'python',
            ...CONFIG.MONACO_CONFIG
        });

        // Listen to language selector changes
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                const language = e.target.value;
                monaco.editor.setModelLanguage(monacoEditor.getModel(), language);
                monacoEditor.setValue(getSampleCode(language));
            });
        }

        // Auto-resize editor
        window.addEventListener('resize', () => {
            if (monacoEditor) {
                monacoEditor.layout();
            }
        });
    });
}

function getSampleCode(language) {
    const samples = {
        python: `# Sample Python Code
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Multiple API calls in a loop
for i in range(100):
    response = requests.get('https://api.example.com/data')
    data = response.json()
    with open(f'file_{i}.txt', 'w') as f:
        f.write(str(data))

# Inefficient nested loops
for i in range(1000):
    for j in range(1000):
        print(i * j)
`,
        javascript: `// Sample JavaScript Code
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Multiple API calls in a loop
for (let i = 0; i < 100; i++) {
    fetch('https://api.example.com/data')
        .then(response => response.json())
        .then(data => {
            fs.writeFileSync(\`file_\${i}.txt\`, JSON.stringify(data));
        });
}

// Inefficient nested loops
for (let i = 0; i < 1000; i++) {
    for (let j = 0; j < 1000; j++) {
        console.log(i * j);
    }
}
`,
        typescript: `// Sample TypeScript Code
function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Multiple API calls in a loop
for (let i = 0; i < 100; i++) {
    fetch('https://api.example.com/data')
        .then(response => response.json())
        .then(data => {
            console.log(data);
        });
}
`,
        java: `// Sample Java Code
public class Example {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        // Inefficient nested loops
        for (int i = 0; i < 1000; i++) {
            for (int j = 0; j < 1000; j++) {
                System.out.println(i * j);
            }
        }
    }
}
`,
        cpp: `// Sample C++ Code
#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    // Inefficient nested loops
    for (int i = 0; i < 1000; i++) {
        for (int j = 0; j < 1000; j++) {
            cout << i * j << endl;
        }
    }
    return 0;
}
`
    };

    return samples[language] || samples.python;
}

function getEditorCode() {
    return monacoEditor ? monacoEditor.getValue() : '';
}

function setEditorCode(code) {
    if (monacoEditor) {
        monacoEditor.setValue(code);
    }
}

function clearEditor() {
    if (monacoEditor) {
        const language = document.getElementById('languageSelect').value;
        monacoEditor.setValue('');
    }
}

// Initialize editor when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeEditor, 100);
});
