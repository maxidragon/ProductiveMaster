from setuptools import setup

setup(
    name="backend",
    packages=["backend"],
    include_package_data=True,
    zip_safe=False,
    entry_points={
        "console_scripts": [
            "task=backend.task:main",
        ]
    }
)