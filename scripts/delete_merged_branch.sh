#!/bin/bash

# 원격 저장소 이름 (보통 origin)
REMOTE="origin"

# 현재 브랜치 이름
CURRENT_BRANCH=$(git branch --show-current)

# 원격에서 머지된 브랜치 목록 가져오기
MERGED_BRANCHES=$(git fetch $REMOTE --prune && git branch -r --merged $REMOTE/main | grep -v "$REMOTE/main" | sed "s|$REMOTE/||")

echo "Merged branches to delete:"
echo "$MERGED_BRANCHES"
echo

# 삭제 확인
read -p "Do you want to delete these branches locally and remotely? [y/N] " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo "Aborted."
  exit 0
fi

# 로컬 브랜치 삭제
for branch in $MERGED_BRANCHES; do
  if [ "$branch" != "$CURRENT_BRANCH" ]; then
    if git show-ref --verify --quiet refs/heads/$branch; then
      echo "Deleting local branch: $branch"
      git branch -d $branch
    fi
  fi
done

# 원격 브랜치 삭제
for branch in $MERGED_BRANCHES; do
  echo "Deleting remote branch: $branch"
  git push $REMOTE --delete $branch
done

echo "Done."
