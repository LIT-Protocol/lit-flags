#!/bin/bash

# Define allowed branch prefixes
allowed_prefixes="feature/ bugfix/ release/"

while read oldrev newrev refname; do
  branch=$(echo "$refname" | sed 's|refs/heads/||')

  if [[ "$branch" =~ ^(feature/|bugfix/|release/) ]]; then
    # Valid branch – allow
    continue
  else
    echo "✖️  Push rejected: Branch name '$branch' is not allowed."
    echo "✅  Allowed branch name prefixes are:"
    for prefix in $allowed_prefixes; do
      echo "   - $prefix"
    done
    echo "💡  Please rename your branch to follow the required naming convention."
    exit 1
  fi
done

exit 0
