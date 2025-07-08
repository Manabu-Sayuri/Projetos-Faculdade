from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager


def capturar_dados_clima():
    options = Options()
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    try:
        driver.get("https://www.climatempo.com.br/previsao-do-tempo/cidade/558/saopaulo-sp")
        wait = WebDriverWait(driver, 15)

        # Temperatura máxima
        temp_max = wait.until(EC.presence_of_element_located(
            (By.XPATH, '//*[@id="max-temp-1"]')
        )).text.strip()

        # Temperatura mínima
        temp_min = wait.until(EC.presence_of_element_located(
            (By.XPATH, '//*[@id="min-temp-1"]')
        )).text.strip()

        # Umidade máxima
        umid_max = wait.until(EC.presence_of_element_located(
            (By.XPATH, '//*[@id="mainContent"]/div[7]/div[3]/div[1]/div[2]/div[2]/div[3]/div[1]/ul/li[4]/div/p/span[2]')
        )).text.strip()

        # Umidade mínima
        umid_min = wait.until(EC.presence_of_element_located(
            (By.XPATH, '//*[@id="mainContent"]/div[7]/div[3]/div[1]/div[2]/div[2]/div[3]/div[1]/ul/li[4]/div/p/span[1]')
        )).text.strip()

        return {
            "temperatura_max": temp_max,
            "temperatura_min": temp_min,
            "umidade_max": umid_max,
            "umidade_min": umid_min
        }

    finally:
        driver.quit()


if __name__ == "__main__":
    dados = capturar_dados_clima()
    print("Temperatura máxima:", dados["temperatura_max"])
    print("Temperatura mínima:", dados["temperatura_min"])
    print("Umidade máxima:", dados["umidade_max"])
    print("Umidade mínima:", dados["umidade_min"])