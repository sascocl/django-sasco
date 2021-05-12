all: install dist

install:
	sudo pip install -e .

dist:
	sudo python setup.py sdist

upload: dist
	twine upload dist/*

clean:
	sudo rm -rf dist django_sasco.egg-info django_sasco/__pycache__ django_sasco/*.pyc
