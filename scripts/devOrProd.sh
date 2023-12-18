#!/bin/bash
env=${1:-local}
rm prisma.$env/dev.db || true
npx prisma migrate dev --schema prisma.$env/schema.prisma
# npx prisma db seed
nodemon server.ts --exec \"ts-node\" server.ts -e ts