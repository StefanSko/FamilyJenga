// ABOUTME: Simple test framework for the dinner seating application
// ABOUTME: Provides test registration, execution, and reporting functionality

const TestFramework = {
    tests: [],
    results: [],

    test(name, fn) {
        this.tests.push({ name, fn });
    },

    assertEquals(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`Expected ${expected}, got ${actual}. ${message}`);
        }
    },

    assertTrue(condition, message = '') {
        if (!condition) {
            throw new Error(`Expected true, got false. ${message}`);
        }
    },

    assertFalse(condition, message = '') {
        if (condition) {
            throw new Error(`Expected false, got true. ${message}`);
        }
    },

    assertNotNull(value, message = '') {
        if (value === null || value === undefined) {
            throw new Error(`Expected non-null value, got ${value}. ${message}`);
        }
    },

    assertContains(container, item, message = '') {
        if (!container.includes(item)) {
            throw new Error(`Expected container to include ${item}. ${message}`);
        }
    },

    runAllTests() {
        this.results = [];
        let passed = 0;
        let failed = 0;

        for (const test of this.tests) {
            try {
                test.fn();
                this.results.push({ name: test.name, status: 'pass', error: null });
                passed++;
            } catch (error) {
                this.results.push({ name: test.name, status: 'fail', error: error.message });
                failed++;
            }
        }

        console.log(`Tests completed: ${passed} passed, ${failed} failed`);
        return { passed, failed, results: this.results };
    },

    displayResults(containerElement) {
        const summary = this.results.reduce((acc, result) => {
            acc[result.status]++;
            return acc;
        }, { pass: 0, fail: 0 });

        let html = `
            <div class="test-section">
                <h3>Test Summary</h3>
                <p class="test-pass">✓ ${summary.pass} passed</p>
                <p class="test-fail">✗ ${summary.fail} failed</p>
            </div>
            <div class="test-section">
                <h3>Test Results</h3>
        `;

        for (const result of this.results) {
            const statusClass = result.status === 'pass' ? 'pass' : 'fail';
            const icon = result.status === 'pass' ? '✓' : '✗';
            const errorMsg = result.error ? `<br><small>${result.error}</small>` : '';
            
            html += `
                <div class="test-item ${statusClass}">
                    <span class="test-${result.status}">${icon}</span> ${result.name}${errorMsg}
                </div>
            `;
        }

        html += '</div>';
        containerElement.innerHTML = html;
    }
};