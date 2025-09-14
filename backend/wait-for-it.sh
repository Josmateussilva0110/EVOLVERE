#!/usr/bin/env sh

set -e

host="$1"
shift
cmd="$@"

until pg_isready -h "$host"; do
  echo "Esperando o PostgreSQL em $host..."
  sleep 2
done

exec $cmd
