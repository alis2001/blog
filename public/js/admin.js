function deleteArticle(id) {
  if (!confirm('Are you sure you want to delete this article?')) {
    return;
  }
  
  console.log('Deleting article:', id);
  
  fetch(`/admin/articles/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Response data:', data);
    if (data.success) {
      alert('Article deleted successfully');
      window.location.reload();
    } else {
      alert(data.message || 'Failed to delete article');
    }
  })
  .catch(error => {
    console.error('Delete error:', error);
    alert('An error occurred while deleting the article: ' + error.message);
  });
}

function deleteCategory(id) {
  if (!confirm('Are you sure you want to delete this category?')) {
    return;
  }
  
  console.log('Deleting category:', id);
  
  fetch(`/admin/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Response data:', data);
    if (data.success) {
      alert('Category deleted successfully');
      window.location.reload();
    } else {
      alert(data.message || 'Failed to delete category');
    }
  })
  .catch(error => {
    console.error('Delete error:', error);
    alert('An error occurred while deleting the category: ' + error.message);
  });
}

function approveUser(id) {
  if (!confirm('Approve this user?')) {
    return;
  }
  
  fetch(`/admin/users/${id}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      window.location.reload();
    } else {
      alert(data.message || 'Failed to approve user');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred');
  });
}

function rejectUser(id) {
  if (!confirm('Reject and remove this user permanently?')) {
    return;
  }
  
  fetch(`/admin/users/${id}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      window.location.reload();
    } else {
      alert(data.message || 'Failed to reject user');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred');
  });
}

function deactivateUser(id) {
  if (!confirm('Deactivate this user?')) {
    return;
  }
  
  fetch(`/admin/users/${id}/deactivate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      window.location.reload();
    } else {
      alert(data.message || 'Failed to deactivate user');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred');
  });
}


// Subscription Management Functions
function toggleSubscriptionStatus(id, currentlyActive) {
  const action = currentlyActive ? 'deactivate' : 'activate';
  if (!confirm(`Are you sure you want to ${action} this subscription?`)) {
    return;
  }
  
  fetch(`/admin/subscriptions/${id}/toggle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      window.location.reload();
    } else {
      alert(data.message || 'Failed to update subscription');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to update subscription');
  });
}

function deleteSubscription(id, email) {
  if (!confirm(`Are you sure you want to permanently delete the subscription for ${email}?`)) {
    return;
  }
  
  fetch(`/admin/subscriptions/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Remove row from table with animation
      const row = document.getElementById(`subscription-${id}`);
      if (row) {
        row.style.opacity = '0.5';
        setTimeout(() => {
          row.remove();
          // Reload if no more rows
          const tbody = document.querySelector('.data-table tbody');
          if (tbody && tbody.children.length === 0) {
            window.location.reload();
          }
        }, 300);
      } else {
        window.location.reload();
      }
    } else {
      alert(data.message || 'Failed to delete subscription');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to delete subscription');
  });
}
