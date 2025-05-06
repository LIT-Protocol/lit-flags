for commit in $merge_commits; do
  parents=$(git log -1 --pretty=%P "$commit")

  for parent in $parents; do
    for protected in "${protected_branches[@]}"; do
      if git merge-base --is-ancestor "$protected" "$parent"; then
        echo "🚫 Merge from '$protected' detected in '$branch'."
        echo "💡 Use 'git rebase $protected' instead of merging."
        exit 1
      fi
    done
  done
done
