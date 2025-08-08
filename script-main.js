let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        let chart = null;
        
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('date').value = new Date().toISOString().split('T')[0];
            document.getElementById('addBtn').addEventListener('click', addExpense);
            render();
            renderChart();
        });
        
        // Add new expense
        function addExpense() {
            const date = document.getElementById('date').value;
            const desc = document.getElementById('desc').value.trim();
            const cat = document.getElementById('cat').value;
            const amt = parseFloat(document.getElementById('amt').value);
            
            if (!date || !desc || !cat || isNaN(amt) || amt <= 0) {
                alert('Please fill all fields with valid values');
                return;
            }
            
            expenses.push({id: Date.now(), date, desc, cat, amt});
            localStorage.setItem('expenses', JSON.stringify(expenses));
            
            // Reset form
            document.getElementById('desc').value = '';
            document.getElementById('cat').value = '';
            document.getElementById('amt').value = '';
            document.getElementById('desc').focus();
            
            render();
            renderChart();
        }
        
        // Render expenses list
        function render() {
            const list = document.getElementById('list');
            list.innerHTML = '';
            let total = 0;
            let todayTotal = 0;
            let monthTotal = 0;
            const today = new Date().toISOString().split('T')[0];
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const categories = new Set();
            
            expenses.forEach(exp => {
                total += exp.amt;
                categories.add(exp.cat);
                
                // Calculate today's expenses
                if (exp.date === today) {
                    todayTotal += exp.amt;
                }
                
                // Calculate this month's expenses
                const expDate = new Date(exp.date);
                if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
                    monthTotal += exp.amt;
                }
                
                // Create row
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatDate(exp.date)}</td>
                    <td>${exp.desc}</td>
                    <td><span class="category-badge ${exp.cat.toLowerCase()}">${exp.cat}</span></td>
                    <td>₹${exp.amt.toFixed(2)}</td>
                    <td class="action-btns">
                        <button class="btn-edit" onclick="editExpense(${exp.id})">✏️ Edit</button>
                        <button class="btn-delete" onclick="deleteExpense(${exp.id})">🗑️ Delete</button>
                    </td>
                `;
                list.appendChild(row);
            });
            
            // Update totals
            document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
            document.getElementById('total-expenses').textContent = `₹${total.toFixed(2)}`;
            document.getElementById('today-expenses').textContent = `₹${todayTotal.toFixed(2)}`;
            document.getElementById('month-expenses').textContent = `₹${monthTotal.toFixed(2)}`;
            document.getElementById('categories-count').textContent = categories.size;
        }
        
        // Delete expense
        function deleteExpense(id) {
            if (confirm('Are you sure you want to delete this expense?')) {
                expenses = expenses.filter(exp => exp.id !== id);
                localStorage.setItem('expenses', JSON.stringify(expenses));
                render();
                renderChart();
            }
        }
        
        // Edit expense (placeholder - would need a more complete implementation)
        function editExpense(id) {
            alert('Edit functionality would be implemented here');
            // In a complete implementation, this would:
            // 1. Find the expense by ID
            // 2. Populate the form with its values
            // 3. Change the add button to an update button
            // 4. Handle the update when clicked
        }
        
        // Format date
        function formatDate(dateString) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-IN', options);
        }
        
        // Render chart
        function renderChart() {
            const ctx = document.getElementById('expenseChart').getContext('2d');
            
            // Group expenses by category
            const categories = {};
            expenses.forEach(exp => {
                if (!categories[exp.cat]) {
                    categories[exp.cat] = 0;
                }
                categories[exp.cat] += exp.amt;
            });
            
            // Destroy previous chart if exists
            if (chart) {
                chart.destroy();
            }
            
            // Create new chart
            chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(categories),
                    datasets: [{
                        data: Object.values(categories),
                        backgroundColor: [
                            '#ffeaa7',
                            '#a5d8ff',
                            '#ffd8a8',
                            '#d0ebff',
                            '#e5dbff'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right',
                        },
                        title: {
                            display: true,
                            text: 'Expenses by Category',
                            font: {
                                size: 16
                            }
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                }
            });
        }