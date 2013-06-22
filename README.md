#Tic-tac-toe AI bot

A NodeJS bot playing/learning tic tac toe using reinforcement learning.

This bot was created for an assignment during an AI course.

If you are doing a similar course and are looking for the answer, I strictly forbid you to use this code.

If you are just bored and looking for AI tic-tac-toe bots writtin in JavaScript, on the other hand, feel free to use this code in any way.


###Some findings
1. The learning factor should gradually decrease, something like 1/(N+1) works pretty well.
2. The amount of random choices should decrease, but should have some positive value for quite long.
3. We could also make the bot learn the rules by punishing bad behaviour (e.g. not waiting when taking a turn)
