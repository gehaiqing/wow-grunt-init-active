mkdir src
mklink /d Gruntfile.js ..\..\example\model1\Gruntfile.js
if not exist ..\..\..\tasks\node_modules (
mklink /d ..\..\..\tasks\node_modules ..\tool\node_modules
	)
mklink /d node_modules ..\..\..\tool\node_modules