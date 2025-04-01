<!-- Terms of Service Page -->
<div class="pt-24 pb-16">
    <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto">
            <div class="mb-12 text-center">
                <h1 class="text-4xl font-bold mb-4">Conditions d'utilisation</h1>
                <p class="text-secondary">Dernière mise à jour : <?= date('d/m/Y') ?></p>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                <div class="prose dark:prose-invert max-w-none">
                    <h2 class="text-2xl font-semibold mb-4">1. Introduction</h2>
                    <p>Bienvenue sur <?= env('APP_NAME') ?>. Les présentes conditions d'utilisation régissent votre utilisation de notre site web et de nos services. En accédant à notre site ou en utilisant nos services, vous acceptez d'être lié par ces conditions. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site ou nos services.</p>
                    
                    <h2 class="text-2xl font-semibold mb-4 mt-8">2. Définitions</h2>
                    <ul class="list-disc pl-6 mb-6 space-y-2">
                        <li><strong>"Nous", "notre", "nos"</strong> désignent <?= env('APP_NAME') ?>.</li>
                        <li><strong>"Vous", "votre", "vos"</strong> désignent l'utilisateur ou le visiteur de notre site web.</li>
                        <li><strong>"Services"</strong> désignent tous les services fournis par <?= env('APP_NAME') ?>, y compris mais sans s'y limiter, l'accès à notre site web, l'utilisation de nos applications et tout autre service que nous proposons.</li>
                        <li><strong>"Contenu"</strong> désigne toutes les informations, textes, images, vidéos, sons, données ou autres matériels que nous mettons à disposition sur notre site web ou par le biais de nos services.</li>
                    </ul>
                    
                    <h2 class="text-2xl font-semibold mb-4 mt-8">3. Utilisation de nos services</h2>
                    <p>Vous acceptez d'utiliser nos services uniquement à des fins légales et conformément aux présentes conditions. Vous acceptez de ne pas utiliser nos services :</p>
                    <ul class="list-disc pl-6 mb-6 space-y-2">
                        <li>D'une manière qui viole toute loi ou réglementation applicable.</li>
                        <li>Pour exploiter, nuire ou tenter d'exploiter ou de nuire à des mineurs de quelque façon que ce soit.</li>
                        <li>Pour transmettre ou faire en sorte que soit envoyé tout matériel publicitaire ou promotionnel non sollicité ou non autorisé.</li>
                        <li>Pour usurper l'identité ou tenter d'usurper l'identité de <?= env('APP_NAME') ?>, d'un employé de <?= env('APP_NAME') ?>, d'un autre utilisateur ou de toute autre personne.</li>
                        <li>D'une manière qui pourrait désactiver, surcharger, endommager ou altérer le site ou interférer avec l'utilisation du site par un tiers.</li>
                    </ul>
                    
                    <h2 class="text-2xl font-semibold mb-4 mt-8">4. Création de compte</h2>
                    <p>Pour accéder à certaines fonctionnalités de notre site, vous devrez peut-être créer un compte. Vous êtes responsable du maintien de la confidentialité de votre compte et de votre mot de passe, et vous acceptez d'assumer la responsabilité de toutes les activités qui se produisent sous votre compte. Vous acceptez de nous informer immédiatement de toute utilisation non autorisée de votre compte ou de toute autre violation de la sécurité.</p>
                    
                    <h2 class="text-2xl font-semibold mb-4 mt-8">5. Propriété intellectuelle</h2>
                    <p>Le contenu de notre site, y compris, mais sans s'y limiter, les textes, graphiques, images, logos, icônes de boutons, logiciels et autre contenu, est la propriété de <?= env('APP_NAME') ?> ou de ses fournisseurs de contenu et est protégé par les lois françaises et internationales sur le droit d'auteur. La compilation de tout le contenu de ce site est la propriété exclusive de <?= env('APP_NAME') ?> et est protégée par les lois françaises et internationales sur le droit d'auteur.</p>
                    
                    <h2 class="text-2xl font-semibold mb-4 mt-8">6. Limitation de responsabilité</h2>
                    <p>En aucun cas, <?= env('APP_NAME') ?>, ses dirigeants, administrateurs, employés, agents, partenaires ou fournisseurs ne seront responsables des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, y compris, sans limitation, la perte de profits, de données, d'utilisation, de bonne volonté ou d'autres pertes intangibles, résultant de :</p>
                    <ul class="list-disc pl-6 mb-6 space-y-2">
                        <li>Votre accès ou utilisation ou incapacité d'accéder ou d'utiliser le service.</li>
                        <li>Toute conduite ou contenu d'un tiers sur le service.</li>
                        <li>Tout contenu obtenu à partir du service.</li>
                        <li>Accès non autorisé, utilisation ou altération de vos transmissions ou contenu.</li>
                    </ul>
                    
                    <h2 class="text-2xl font-semibold mb-4 mt-8">7. Indemnisation</h2>
                    <p>Vous acceptez de défendre, d'indemniser et de tenir <?= env('APP_NAME') ?> et ses concédants de licence et concédants indemnes de toute réclamation, responsabilité, dommage, jugement, attribution, perte, coût, dépense ou honoraires (y compris les honoraires d'avocat raisonnables) résultant de ou liés à votre violation de ces conditions d'utilisation ou de votre utilisation du site web, y compris, mais sans s'y limiter, vos soumissions d'utilisateur, toute utilisation du contenu, des services et des produits du site web autre que celle expressément autorisée dans ces conditions d'utilisation ou votre utilisation de toute information obtenue à partir du site web.</p>
                    
                    <h2 class="text-2xl font-semibold mb-4 mt-8">8. Modifications des conditions</h2>
                    <p>Nous nous réservons le droit, à notre seule discrétion, de modifier ou de remplacer ces conditions à tout moment. Si une révision est importante, nous fournirons un préavis d'au moins 30 jours avant que les nouvelles conditions ne prennent effet. Ce qui constitue un changement important sera déterminé à notre seule discrétion.</p>
                    
                    <h2 class="text-2xl font-semibold mb-4 mt-8">9. Loi applicable</h2>
                    <p>Ces conditions sont régies et interprétées conformément aux lois françaises, et vous vous soumettez irrévocablement à la juridiction exclusive des tribunaux de cette juridiction.</p>
                    
                    <h2 class="text-2xl font-semibold mb-4 mt-8">10. Contact</h2>
                    <p>Si vous avez des questions concernant ces conditions, veuillez nous contacter à l'adresse suivante : <a href="mailto:contact@mhemery.fr" class="text-accent-primary hover:underline">contact@mhemery.fr</a>.</p>
                </div>
            </div>
            
            <div class="text-center">
                <a href="/" class="btn-secondary inline-flex items-center">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Retour à l'accueil
                </a>
            </div>
        </div>
    </div>
</div> 