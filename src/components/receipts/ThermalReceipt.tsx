"use client";

import { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface VentaDetalle {
  id?: string | number;
  cliente?: string;
  titular?: {
    nombre?: string;
  };
  plan?: string;
  total?: number;
  monto_total?: number;
  beneficiarios?: Array<{ nombre?: string }>;
  mascotas?: Array<{ nombre?: string }>;
}

interface ThermalReceiptProps {
  venta: {
    id: string | number;
    cliente?: string;
    plan?: string;
    total?: number;
    monto_total?: number;
    metodoPago?: string;
    metodo_pago?: string;
    estado?: string;
    estado_pago?: string;
    created_at?: string;
    createdAt?: string;
    vendidoPor?: string;
    titular?: {
      nombre?: string;
      documento?: string;
      telefono?: string;
      email?: string;
    };
    beneficiarios?: Array<{ nombre?: string }>;
    mascotas?: Array<{ nombre?: string }>;
    ventasDetalle?: VentaDetalle[];
  };
  tipo: "cliente" | "cierre";
  establecimiento?: {
    nombre: string;
    nit: string;
    direccion: string;
    telefono: string;
    ciudad: string;
  };
}

export function ThermalReceipt({
  venta,
  tipo,
  establecimiento,
}: ThermalReceiptProps) {
  const defaultEstablecimiento = {
    nombre: "Jardines del Renacer",
    nit: "900.123.456-7",
    direccion: "Carrera 7 #32-16",
    telefono: "(601) 123-4567",
    ciudad: "Bogotá, Colombia",
  };

  const info = establecimiento || defaultEstablecimiento;
  const facturaUrl = `https://factura.com/verify/${venta.id}`;

  // Generar CUFE único basado en el ID de venta
  const cufe = useMemo(
    () => `CUFE${venta.id}${venta.id.toString().padStart(10, "0")}`,
    [venta.id]
  );

  return (
    <div
      className="receipt-thermal"
      style={{
        width: "80mm",
        fontFamily: "Courier New, monospace",
        fontSize: "12px",
        padding: "10mm",
        backgroundColor: "white",
        color: "black",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "15px",
          borderBottom: "2px dashed black",
          paddingBottom: "10px",
        }}
      >
        <div
          style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "5px" }}
        >
          {info.nombre.toUpperCase()}
        </div>
        <div style={{ fontSize: "11px" }}>NIT: {info.nit}</div>
        <div style={{ fontSize: "11px" }}>{info.direccion}</div>
        <div style={{ fontSize: "11px" }}>{info.ciudad}</div>
        <div style={{ fontSize: "11px" }}>Tel: {info.telefono}</div>
      </div>

      {/* Tipo de Documento */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <div style={{ fontSize: "14px", fontWeight: "bold" }}>
          {tipo === "cliente" ? "FACTURA DE VENTA" : "CIERRE DE VENTAS"}
        </div>
        <div style={{ fontSize: "11px", marginTop: "5px" }}>
          Factura Electrónica de Venta
        </div>
        <div style={{ fontSize: "11px" }}>
          No. {venta.id.toString().padStart(8, "0")}
        </div>
      </div>

      {/* Fecha y Hora */}
      <div
        style={{
          marginBottom: "15px",
          borderBottom: "1px dashed black",
          paddingBottom: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
          }}
        >
          <span>Fecha:</span>
          <span>
            {formatDate(
              venta.created_at || venta.createdAt || new Date().toISOString()
            )}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
          }}
        >
          <span>Hora:</span>
          <span>
            {new Date(
              venta.created_at || venta.createdAt || new Date()
            ).toLocaleTimeString("es-CO")}
          </span>
        </div>
        {venta.vendidoPor && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
            }}
          >
            <span>Vendedor:</span>
            <span>{venta.vendidoPor}</span>
          </div>
        )}
      </div>

      {/* Datos del Cliente */}
      {tipo === "cliente" && (
        <div
          style={{
            marginBottom: "15px",
            borderBottom: "1px dashed black",
            paddingBottom: "10px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            DATOS DEL CLIENTE
          </div>
          <div style={{ fontSize: "11px" }}>
            Nombre:{" "}
            {venta.cliente || venta.titular?.nombre || "Cliente General"}
          </div>
          {venta.titular?.documento && (
            <div style={{ fontSize: "11px" }}>
              CC: {venta.titular.documento}
            </div>
          )}
          {venta.titular?.telefono && (
            <div style={{ fontSize: "11px" }}>
              Tel: {venta.titular.telefono}
            </div>
          )}
          {venta.titular?.email && (
            <div style={{ fontSize: "11px" }}>Email: {venta.titular.email}</div>
          )}
        </div>
      )}

      {/* Detalle de Productos/Servicios */}
      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            marginBottom: "8px",
            borderBottom: "1px solid black",
            paddingBottom: "3px",
          }}
        >
          DETALLE
        </div>

        <div style={{ fontSize: "11px", marginBottom: "5px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{venta.plan || "Plan Exequial"}</span>
            <span>{formatCurrency(venta.total || venta.monto_total || 0)}</span>
          </div>
        </div>

        {venta.titular && (
          <div style={{ fontSize: "10px", marginLeft: "5px", color: "#555" }}>
            • Titular: 1 persona
          </div>
        )}

        {venta.beneficiarios && venta.beneficiarios.length > 0 && (
          <div style={{ fontSize: "10px", marginLeft: "5px", color: "#555" }}>
            • Beneficiarios: {venta.beneficiarios.length} persona(s)
          </div>
        )}

        {venta.mascotas && venta.mascotas.length > 0 && (
          <div style={{ fontSize: "10px", marginLeft: "5px", color: "#555" }}>
            • Mascotas: {venta.mascotas.length}
          </div>
        )}
      </div>

      {/* Totales */}
      <div
        style={{
          marginTop: "15px",
          borderTop: "2px solid black",
          paddingTop: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
            marginBottom: "3px",
          }}
        >
          <span>Subtotal:</span>
          <span>{formatCurrency(venta.total || venta.monto_total || 0)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
            marginBottom: "3px",
          }}
        >
          <span>IVA (0%):</span>
          <span>{formatCurrency(0)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            fontWeight: "bold",
            marginTop: "5px",
            borderTop: "1px solid black",
            paddingTop: "5px",
          }}
        >
          <span>TOTAL:</span>
          <span>{formatCurrency(venta.total || venta.monto_total || 0)}</span>
        </div>
      </div>

      {/* Método de Pago */}
      <div
        style={{
          marginTop: "15px",
          borderTop: "1px dashed black",
          paddingTop: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
          }}
        >
          <span>Método de Pago:</span>
          <span style={{ fontWeight: "bold" }}>
            {venta.metodoPago || venta.metodo_pago || "N/A"}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
          }}
        >
          <span>Estado:</span>
          <span
            style={{
              fontWeight: "bold",
              color:
                venta.estado_pago === "APPROVED" ||
                venta.estado === "completada"
                  ? "green"
                  : "orange",
            }}
          >
            {venta.estado_pago === "APPROVED" || venta.estado === "completada"
              ? "PAGADO"
              : "PENDIENTE"}
          </span>
        </div>
      </div>

      {/* QR Code y CUFE */}
      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          borderTop: "2px dashed black",
          paddingTop: "15px",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <QRCodeSVG
            value={facturaUrl}
            size={120}
            level="M"
            includeMargin={true}
          />
        </div>
        <div
          style={{
            fontSize: "9px",
            wordBreak: "break-all",
            marginBottom: "5px",
          }}
        >
          CUFE: {cufe}
        </div>
        <div style={{ fontSize: "10px", marginTop: "5px" }}>
          Verifique en: factura.com
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "20px",
          borderTop: "1px dashed black",
          paddingTop: "10px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "10px", marginBottom: "5px" }}>
          Factura electrónica validada por la DIAN
        </div>
        <div style={{ fontSize: "10px", marginBottom: "5px" }}>
          Resolución DIAN 18764003216761 del 06/09/2024
        </div>
        <div style={{ fontSize: "10px", marginBottom: "5px" }}>
          Rango autorizado: 1 - 5000000
        </div>
        <div style={{ fontSize: "10px", marginBottom: "10px" }}>
          Vigencia: 06/09/2024 - 06/09/2026
        </div>
        <div
          style={{ fontSize: "11px", fontWeight: "bold", marginTop: "10px" }}
        >
          ¡GRACIAS POR SU COMPRA!
        </div>
        <div style={{ fontSize: "10px", marginTop: "5px" }}>
          www.jardinesdelrenacer.com
        </div>
      </div>

      {tipo === "cierre" &&
        venta.ventasDetalle &&
        venta.ventasDetalle.length > 0 && (
          <div
            style={{
              marginTop: "20px",
              borderTop: "2px solid black",
              paddingTop: "10px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              RESUMEN DETALLADO DEL DÍA
            </div>
            <div style={{ fontSize: "11px", marginBottom: "10px" }}>
              Total de Ventas: {venta.ventasDetalle.length}
            </div>

            {/* Resumen por categoría */}
            <div
              style={{
                fontSize: "10px",
                marginBottom: "15px",
                backgroundColor: "#f5f5f5",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                RESUMEN GENERAL:
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "3px",
                }}
              >
                <span>• Total Beneficiarios:</span>
                <span style={{ fontWeight: "bold" }}>
                  {venta.ventasDetalle.reduce(
                    (sum: number, v: VentaDetalle) =>
                      sum + (v.beneficiarios?.length || 0),
                    0
                  )}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "3px",
                }}
              >
                <span>• Total Mascotas:</span>
                <span style={{ fontWeight: "bold" }}>
                  {venta.ventasDetalle.reduce(
                    (sum: number, v: VentaDetalle) =>
                      sum + (v.mascotas?.length || 0),
                    0
                  )}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  borderTop: "1px solid #ccc",
                  marginTop: "5px",
                  paddingTop: "5px",
                }}
              >
                <span>• Total Ventas:</span>
                <span>
                  {formatCurrency(venta.total || venta.monto_total || 0)}
                </span>
              </div>
            </div>

            {/* Detalle de cada venta */}
            <div
              style={{
                fontSize: "10px",
                borderTop: "1px solid black",
                paddingTop: "10px",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                DETALLE POR VENTA:
              </div>
              {venta.ventasDetalle.map(
                (ventaDetalle: VentaDetalle, index: number) => {
                  const numBeneficiarios =
                    ventaDetalle.beneficiarios?.length || 0;
                  const numMascotas = ventaDetalle.mascotas?.length || 0;
                  const montoVenta =
                    ventaDetalle.total || ventaDetalle.monto_total || 0;
                  const totalVentas = venta.ventasDetalle?.length || 0;

                  return (
                    <div
                      key={index}
                      style={{
                        marginBottom: "12px",
                        paddingBottom: "8px",
                        borderBottom:
                          index < totalVentas - 1 ? "1px dashed #ccc" : "none",
                      }}
                    >
                      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                        Venta #
                        {ventaDetalle.id?.toString().padStart(4, "0") ||
                          index + 1}
                      </div>
                      <div style={{ marginLeft: "8px" }}>
                        <div style={{ marginBottom: "2px" }}>
                          Cliente:{" "}
                          {ventaDetalle.cliente ||
                            ventaDetalle.titular?.nombre ||
                            "N/A"}
                        </div>
                        <div style={{ marginBottom: "2px" }}>
                          Plan: {ventaDetalle.plan || "Plan Exequial"}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "2px",
                          }}
                        >
                          <span>- Beneficiarios:</span>
                          <span style={{ fontWeight: "bold" }}>
                            {numBeneficiarios} persona(s)
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "2px",
                          }}
                        >
                          <span>- Mascotas:</span>
                          <span style={{ fontWeight: "bold" }}>
                            {numMascotas}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "4px",
                            fontWeight: "bold",
                          }}
                        >
                          <span>Valor:</span>
                          <span>{formatCurrency(montoVenta)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
    </div>
  );
}
