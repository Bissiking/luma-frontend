    <!-- Pied de page -->
    <footer class="bg-secondary-light dark:bg-secondary-dark pt-16 pb-8">
        <div class="container mx-auto px-6">
            <!-- Footer Top Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <!-- About -->
                <div class="glass">
                    <div class="mb-6">
                        <img src="/assets/images/luma/luma75.png"
                            alt="LUMA"
                            class="h-10 hover-scale">
                    </div>
                    <p class="text-secondary text-sm mb-6">
                        Des solutions personnelles pour votre divertissement et votre productivité numérique.
                    </p>
                    <div class="flex space-x-4">
                        <a href="https://www.linkedin.com/in/mathéo-hemery-5a5a59303" class="social-icon" aria-label="LinkedIn">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a href="https://github.com/Bissiking" class="social-icon" aria-label="GitHub">
                            <i class="fab fa-github"></i>
                        </a>
                        <a href="https://discord.me/amether-community" class="social-icon" aria-label="Discord">
                            <i class="fab fa-discord"></i>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="flex flex-col md:flex-row md:items-center justify-between">
                <p class="text-secondary text-sm mb-4 md:mb-0">
                    &copy; <?= date('Y') ?> LUMA. Tous droits réservés.
                </p>
                <div class="flex flex-wrap gap-4">
                    <a href="#" class="footer-link">In DEV</a>
                    <!-- <a href="/privacy" class="footer-link">Politique de confidentialité</a>
                    <a href="/terms" class="footer-link">Conditions d'utilisation</a>
                    <a href="/cookies" class="footer-link">Cookies</a> -->
                </div>
            </div>
        </div>
    </footer>
    </body>

    </html>