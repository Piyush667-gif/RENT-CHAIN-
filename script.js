
        // Loading screen
        window.addEventListener('load', function() {
            setTimeout(() => {
                document.getElementById('loadingScreen').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('loadingScreen').style.display = 'none';
                }, 500);
            }, 2000);
        });

        // Navigation
        function showSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('.section-content').forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show selected section
            document.getElementById(sectionId).classList.remove('hidden');
            
            // Update nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('text-chain-blue', 'font-semibold');
                link.classList.add('text-gray-700');
            });
            
            // Scroll to top
            window.scrollTo(0, 0);
        }

        // Dark mode toggle
        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            const navbar = document.getElementById('navbar');
            navbar.classList.toggle('bg-gray-800');
            navbar.classList.toggle('bg-white/95');
            
            // Toggle particles
            const lightParticles = document.getElementById('lightParticles');
            const darkParticles = document.getElementById('darkParticles');
            
            if (document.body.classList.contains('dark-mode')) {
                lightParticles.classList.add('hidden');
                darkParticles.classList.remove('hidden');
            } else {
                lightParticles.classList.remove('hidden');
                darkParticles.classList.add('hidden');
            }
            
            // Add transition effect
            document.body.style.transition = 'all 0.5s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 500);
        }

        // Notifications
        function toggleNotifications() {
            const dropdown = document.getElementById('notificationDropdown');
            dropdown.classList.toggle('hidden');
        }

        // Close notifications when clicking outside
        document.addEventListener('click', function(event) {
            const dropdown = document.getElementById('notificationDropdown');
            const button = event.target.closest('button');
            if (!button || !button.onclick || button.onclick.toString().indexOf('toggleNotifications') === -1) {
                dropdown.classList.add('hidden');
            }
        });

        // Verification
        function selectUserType(type) {
            // Remove active state from all buttons
            document.querySelectorAll('.user-type-btn').forEach(btn => {
                btn.classList.remove('border-chain-blue', 'bg-chain-blue/5');
                btn.classList.add('border-gray-200');
            });
            
            // Add active state to selected button
            event.target.closest('.user-type-btn').classList.add('border-chain-blue', 'bg-chain-blue/5');
            event.target.closest('.user-type-btn').classList.remove('border-gray-200');
            
            // Show verification steps
            document.getElementById('verificationSteps').classList.remove('hidden');
            
            // Store selected type
            window.selectedUserType = type;
        }

        function submitVerification() {
            // Show loading state
            const button = event.target;
            const originalText = button.textContent;
            button.innerHTML = '<div class="loading-spinner mx-auto"></div>';
            button.disabled = true;
            
            setTimeout(() => {
                button.innerHTML = '✓ Verification Submitted';
                button.classList.remove('bg-gradient-to-r', 'from-chain-blue', 'to-chain-green');
                button.classList.add('bg-green-500');
                
                // Show success notification
                showNotification('Verification submitted successfully! You will receive an update within 24 hours.', 'success');
            }, 3000);
        }

        // Agreements
        function signAgreement() {
            const button = event.target;
            button.innerHTML = '<div class="loading-spinner mx-auto"></div>';
            button.disabled = true;
            
            setTimeout(() => {
                button.innerHTML = '✓ Agreement Signed';
                button.classList.remove('bg-gradient-to-r', 'from-chain-blue', 'to-chain-green');
                button.classList.add('bg-green-500');
                
                // Show success notification
                showNotification('Agreement signed successfully! Blockchain verification complete.', 'success');
            }, 2000);
        }

        // Dashboard
        function showDashboard(type) {
            // Update tab buttons
            document.querySelectorAll('.dashboard-tab').forEach(tab => {
                tab.classList.remove('bg-chain-blue', 'text-white');
                tab.classList.add('text-gray-600');
            });
            
            event.target.classList.add('bg-chain-blue', 'text-white');
            event.target.classList.remove('text-gray-600');
            
            // For demo, we'll just show the tenant dashboard
            // In a real app, you'd switch between different dashboard views
        }

        // Chat functionality
        function toggleChat() {
            const chatWindow = document.getElementById('chatWindow');
            chatWindow.classList.toggle('hidden');
        }

        function openChat(propertyName) {
            const chatWindow = document.getElementById('chatWindow');
            const chatMessages = document.getElementById('chatMessages');
            
            // Add property inquiry message
            const message = document.createElement('div');
            message.className = 'bg-chain-blue text-white rounded-lg p-3 max-w-xs ml-auto';
            message.innerHTML = `<p class="text-sm">I'm interested in "${propertyName}". Can you provide more details?</p>`;
            chatMessages.appendChild(message);
            
            // Show chat window
            chatWindow.classList.remove('hidden');
            
            // Auto-scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simulate AI response
            setTimeout(() => {
                const response = document.createElement('div');
                response.className = 'bg-gray-100 rounded-lg p-3 max-w-xs';
                response.innerHTML = `<p class="text-sm">Great choice! ${propertyName} is available for immediate move-in. Would you like to schedule a virtual tour or get more information about the lease terms?</p>`;
                chatMessages.appendChild(response);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }

        function sendMessage() {
            const input = document.getElementById('chatInput');
            const message = input.value.trim();
            
            if (message) {
                const chatMessages = document.getElementById('chatMessages');
                
                // Add user message
                const userMessage = document.createElement('div');
                userMessage.className = 'bg-chain-blue text-white rounded-lg p-3 max-w-xs ml-auto';
                userMessage.innerHTML = `<p class="text-sm">${message}</p>`;
                chatMessages.appendChild(userMessage);
                
                // Clear input
                input.value = '';
                
                // Auto-scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate AI response
                setTimeout(() => {
                    const response = document.createElement('div');
                    response.className = 'bg-gray-100 rounded-lg p-3 max-w-xs';
                    response.innerHTML = `<p class="text-sm">Thanks for your message! I'm processing your request and will get back to you shortly with the information you need.</p>`;
                    chatMessages.appendChild(response);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            }
        }

        function sendQuickReply(reply) {
            const chatMessages = document.getElementById('chatMessages');
            
            // Add user message
            const userMessage = document.createElement('div');
            userMessage.className = 'bg-chain-blue text-white rounded-lg p-3 max-w-xs ml-auto';
            userMessage.innerHTML = `<p class="text-sm">${reply}</p>`;
            chatMessages.appendChild(userMessage);
            
            // Auto-scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simulate AI response based on quick reply
            setTimeout(() => {
                const response = document.createElement('div');
                response.className = 'bg-gray-100 rounded-lg p-3 max-w-xs';
                
                let responseText = '';
                switch(reply) {
                    case 'Search Property':
                        responseText = 'I can help you find the perfect property! What type of property are you looking for and in which area?';
                        break;
                    case 'Draft Agreement':
                        responseText = 'I\'ll help you create a rental agreement. Do you need a standard rental, furnished rental, or commercial lease agreement?';
                        break;
                    case 'Estimate Rent':
                        responseText = 'I can provide rental estimates for your area. Please share the property location and type for an accurate estimate.';
                        break;
                    default:
                        responseText = 'How can I assist you with that?';
                }
                
                response.innerHTML = `<p class="text-sm">${responseText}</p>`;
                chatMessages.appendChild(response);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }

        // Allow Enter key to send messages
        document.getElementById('chatInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Notification system
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification-slide fixed top-24 right-6 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
                type === 'success' ? 'bg-green-500 text-white' : 
                type === 'error' ? 'bg-red-500 text-white' : 
                'bg-blue-500 text-white'
            }`;
            notification.innerHTML = `
                <div class="flex items-center justify-between">
                    <p class="text-sm">${message}</p>
                    <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                        </svg>
                    </button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 5000);
        }

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            // Show home section by default
            showSection('home');
        });



