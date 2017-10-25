BUILDDATE		:= $(shell date +%s)
BUILDREV		:= $(shell git log --pretty=format:'%h' -n 1)

pack:
	npm run build
	tar --exclude=*.map -czvf gocrack-ui-$(BUILDREV)-$(BUILDDATE).tgz dist/*

clean:
	rm -rf dist/
	rm *.tgz

all: pack