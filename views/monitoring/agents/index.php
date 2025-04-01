<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Agents de monitoring</h3>
                    <div class="card-tools">
                        <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal-add-agent">
                            <i class="fas fa-plus"></i> Ajouter un agent
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>IP</th>
                                    <th>Statut</th>
                                    <th>Version</th>
                                    <th>Dernière vérification</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="agents-list">
                                <tr>
                                    <td colspan="6" class="text-center">Chargement des agents...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> 