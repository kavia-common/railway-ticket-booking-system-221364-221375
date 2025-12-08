#!/bin/bash
cd /home/kavia/workspace/code-generation/railway-ticket-booking-system-221364-221375/train_booking_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

