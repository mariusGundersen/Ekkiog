memory
|0 |1 |2 |3 |4 |5 |6 |7 |
+-----------+-----------+
|           |           |
+-----+-----+-----+-----+
|     |     |     |     |
+--+--+--+--+--+--+--+--+
|AB|  |  |  |  |  |  |  |
+--+--+--+--+--+--+--+--+

components = [...component...]

component = gateAddress|size

gateAddress -> blockId|index

blockId -> blockAddress

gate = inputA|inputB

gateTree = [...freeOrUsed...]

freeOrUsed = true/false

|0|1|2|3|4|5|6|7|
+-------+-------+
|0      |0      |
+---+---+---+---+
|0  |0  |1  |0  |
+-+-+-+-+-+-+-+-+
|1|0|0|1|1|1|0|0|
+-+-+-+-+-+-+-+-+
 | | | | | | | |
 V V V V V V V V
 1 0 0 1 3 1 0 0