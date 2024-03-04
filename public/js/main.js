document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const entityId = this.getAttribute('data-id');
            const entity = this.getAttribute('data-entity');
            const confirmation = confirm('Are you sure you want to delete this record?');
            if (confirmation) {
                fetch(`/api/${entity}/${entityId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(response => {
                    if (response.ok) {
                        console.log(`Record with ID ${entityId} deleted successfully from ${entity}.`);
                        window.location.reload();
                    } else {
                        alert('Error deleting the record. Please try again.');
                        console.error(`Failed to delete the record with ID ${entityId} from ${entity}.`);
                    }
                }).catch(error => {
                    console.error('Error deleting record:', error.message, error.stack);
                });
            }
        });
    });
});