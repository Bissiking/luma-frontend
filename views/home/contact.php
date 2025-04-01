<!-- Contact Section -->
<section class="contact-section py-16 md:py-24">
    <div class="container mx-auto px-6">
        <h1 class="text-4xl md:text-5xl font-bold mb-12 text-center text-gradient">Contactez-nous</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <!-- Contact Form -->
            <div class="glass p-8 rounded-xl shadow-lg">
                <h2 class="text-2xl font-semibold mb-6">Envoyez-nous un message</h2>
                
                <form action="/contact/submit" method="POST" class="space-y-6">
                    <div>
                        <label for="name" class="block text-secondary mb-2">Nom complet</label>
                        <input type="text" id="name" name="name" required 
                               class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition">
                    </div>
                    
                    <div>
                        <label for="email" class="block text-secondary mb-2">Adresse e-mail</label>
                        <input type="email" id="email" name="email" required 
                               class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition">
                    </div>
                    
                    <div>
                        <label for="subject" class="block text-secondary mb-2">Sujet</label>
                        <input type="text" id="subject" name="subject" required 
                               class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition">
                    </div>
                    
                    <div>
                        <label for="message" class="block text-secondary mb-2">Message</label>
                        <textarea id="message" name="message" rows="5" required 
                                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition"></textarea>
                    </div>
                    
                    <button type="submit" class="btn-primary w-full">Envoyer le message</button>
                </form>
            </div>
            
            <!-- Contact Info -->
            <div>
                <h2 class="text-2xl font-semibold mb-6">Informations de contact</h2>
                
                <div class="space-y-6">
                    <div class="flex items-start">
                        <div class="text-primary mr-4">
                            <i class="fas fa-map-marker-alt text-2xl"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold">Adresse</h3>
                            <p class="text-secondary">Caen, France</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="text-primary mr-4">
                            <i class="fas fa-envelope text-2xl"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold">Email</h3>
                            <p class="text-secondary">contact@luma-services.fr</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="text-primary mr-4">
                            <i class="fas fa-phone-alt text-2xl"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold">Téléphone</h3>
                            <p class="text-secondary">+33 6 XX XX XX XX</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="text-primary mr-4">
                            <i class="fas fa-clock text-2xl"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold">Heures d'ouverture</h3>
                            <p class="text-secondary">Lun - Ven: 9h00 - 18h00</p>
                        </div>
                    </div>
                </div>
                
                <div class="mt-8">
                    <h3 class="font-semibold mb-4">Suivez-nous</h3>
                    <div class="flex space-x-4">
                        <a href="https://github.com/Bissiking" class="social-icon" aria-label="GitHub">
                            <i class="fab fa-github"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/mathéo-hemery-5a5a59303" class="social-icon" aria-label="LinkedIn">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a href="https://discord.me/amether-community" class="social-icon" aria-label="Discord">
                            <i class="fab fa-discord"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section> 